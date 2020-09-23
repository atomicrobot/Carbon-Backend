import { Router, Request } from 'express';
import { AppLogger, buildConsoleLogger } from '@util/logger';
import { buildCloudLoggingLogger } from '@clients/gcp/cloudLogging';
import { GoogleAuth } from 'google-auth-library';
import { ServerError } from '@models/error';

declare global {
    namespace Express {
        interface Application {
            dependencies: AppDependencies
        }

        interface Request {
            metadata: RequestMetadata
        }
    }
};

export interface AppConfig {
    serviceName: string,
    production: boolean,
    buildDate: string,
    buildSha: string,
    buildNumber: string,
    serverPort: number,
    logName: string
}

export type AppDependencies = {
    config: AppConfig,
    testingRoutes?: Router,
    logger: AppLogger
};

export type RequestMetadata = {
    language: string
}

export function buildAppConfig(): AppConfig {
    return {
        serviceName: `${process.env.SERVICE_NAME}`,
        production: process.env.NODE_ENV === 'production',
        buildDate: `${process.env.BUILD_DATE}`,
        buildSha: `${process.env.BUILD_SHA}`,
        buildNumber: `${process.env.BUILD_NUMBER}`,
        serverPort: Number(process.env.PORT || 3000),
        logName: `${process.env.LOG_NAME}`
    }
}

export async function buildAppDependencies(config: AppConfig): Promise<AppDependencies> {
    if (config.production) {
        try {
            await new GoogleAuth().getCredentials()
        } catch (err) {
            throw new ServerError('Server is not correctly configured to communicate with GCP', err);
        }
    }

    return {
        config,
        logger: config.production ? await buildCloudLoggingLogger(config) : buildConsoleLogger()
    }
}

export function buildRequestMetadata(req: Request): RequestMetadata {
    return {
        language: req.headers['accept-language'] ?? 'en',
    }
}
