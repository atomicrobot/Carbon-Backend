import { loadPackagedEnvironmentVariables } from '@util/envvar';
import { AppLogger } from '@util/logger';
import { Router } from 'express';

export type SetupAppEnvironment = () => Promise<void>;

export type AppDependencyBuilder = (config: AppConfig) => Promise<AppDependencies>;

export function isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
}

export interface AppConfig {
    serviceName: string,
    buildDate: string,
    buildSha: string,
    buildNumber: string,
    serverPort: number,
    logName: string
}

export interface AppDependencies {
    config: AppConfig,
    testingRoutes?: Router,
    logger: AppLogger
};

export async function buildAppConfig(): Promise<AppConfig> {
    loadPackagedEnvironmentVariables();

    if (isProduction()) {
        const { setupAppEnvironment } = await import('@app/config.prod');
        await setupAppEnvironment();
    } else {
        const { setupAppEnvironment } = await import('@app/config.nonprod');
        await setupAppEnvironment();
    }

    return {
        serviceName: `${process.env.SERVICE_NAME}`,
        buildDate: `${process.env.BUILD_DATE}`,
        buildSha: `${process.env.BUILD_SHA}`,
        buildNumber: `${process.env.BUILD_NUMBER}`,
        serverPort: Number(process.env.PORT || 3000),
        logName: `${process.env.LOG_NAME}`
    }
}

export async function buildAppDependencies(config: AppConfig): Promise<AppDependencies> {
    if (isProduction()) {
        const { dependencyBuilder } = await import('@app/config.prod');
        return await dependencyBuilder(config);
    } else {
        const { dependencyBuilder } = await import('@app/config.nonprod');
        return await dependencyBuilder(config);
    }
}
