import { AppLogger } from '@util/logger';
import { Router } from 'express';

export type SetupAppEnvironment = () => Promise<void>;

export type AppDependencyBuilder = (
    config: AppConfig
) => Promise<AppDependencies>;

export function isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
}

export interface AppConfig {
    apiSpec: string;
    serviceName: string;
    buildDate: string;
    buildSha: string;
    buildNumber: string;
    serverPort: number;
    logName: string;
}

export interface AppDependencies {
    config: AppConfig;
    testingRoutes?: Router;
    logger: AppLogger;
};

export async function buildAppConfig(apiSpec: string): Promise<AppConfig> {
    // This ensures that production dependencies are not loaded into development runtimes (and vice versa)
    // GCP dependencies tend to have side effects just from being imported that we want to avoid
    const setupAppEnvironment = isProduction() ? await productionAppSetup() : await nonProductionAppSetup();
    await setupAppEnvironment();

    return {
        apiSpec,
        serviceName: `${process.env.SERVICE_NAME}`,
        buildDate: `${process.env.BUILD_DATE}`,
        buildSha: `${process.env.BUILD_SHA}`,
        buildNumber: `${process.env.BUILD_NUMBER}`,
        serverPort: Number(process.env.PORT || 3000),
        logName: `${process.env.LOG_NAME}`
    };
}

async function productionAppSetup(): Promise<SetupAppEnvironment> {
    const { setupAppEnvironment } = await import('@app/config.prod');
    return setupAppEnvironment;
}

async function nonProductionAppSetup(): Promise<SetupAppEnvironment> {
    const { setupAppEnvironment } = await import('@app/config.nonprod');
    return setupAppEnvironment;
}

export async function buildAppDependencies(config: AppConfig): Promise<AppDependencies> {
    const dependencyBuilder = isProduction() ? await productionDependencyBuilder() : await nonProductionDependencyBuilder();
    return await dependencyBuilder(
        config,
    );
}

async function productionDependencyBuilder(): Promise<AppDependencyBuilder> {
    const { dependencyBuilder } = await import('@app/config.prod');
    return dependencyBuilder;
}

async function nonProductionDependencyBuilder(): Promise<AppDependencyBuilder> {
    const { dependencyBuilder } = await import('@app/config.nonprod');
    return dependencyBuilder;
}