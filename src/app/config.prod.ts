import { format } from 'winston';
import correlator from 'express-correlation-id';
import { AppConfig, SetupAppEnvironment, AppDependencies, AppDependencyBuilder } from '@app/config';
import { WinstonLogger } from '@util/logger';
import { buildCloudLoggingLogger } from '@clients/gcp/cloudLogging';
import { checkGCPConfiguration } from '@clients/gcp/system';
import { loadSecret } from '@clients/gcp/secretManager';
import { ServerError } from '@models/error';
import { loadEnvironmentVariablesFromMemory, loadPackagedEnvironmentVariables } from '@util/envvar';

async function loadSecretManagerEnvironmentVariables() {
    if (process.env.GCP_SECRET_MANAGER_CONFIG_RESOURCE_ID === undefined) {
        throw new ServerError('GCP_SECRET_MANAGER_CONFIG_RESOURCE_ID is not defined');
    }

    const secret = await loadSecret(process.env.GCP_SECRET_MANAGER_CONFIG_RESOURCE_ID);
    if (secret === undefined) {
        throw new ServerError(`${process.env.GCP_SECRET_MANAGER_CONFIG_RESOURCE_ID} is not set in the GCP project`);
    }

    loadEnvironmentVariablesFromMemory(secret);
}

export const setupAppEnvironment: SetupAppEnvironment = async (): Promise<void> => {
    loadPackagedEnvironmentVariables();
    await loadSecretManagerEnvironmentVariables();
}

export const dependencyBuilder: AppDependencyBuilder = async (config: AppConfig): Promise<AppDependencies> => {
    const error = await checkGCPConfiguration();
    if (error) {
        throw error;
    }

    const logger = buildLogger(config);
    return {
        config,
        logger
    }
}

function buildLogger(config: AppConfig): WinstonLogger {
    const logCorrelationId = format(info => {
        const id = correlator.getId();
        if (id) {
            info['x-request-id'] = id;
        }

        return info;
    });

    return new WinstonLogger(buildCloudLoggingLogger({
        logName: config.logName,
        serviceName: config.serviceName,
        version: config.buildNumber,
        formats: [
            logCorrelationId()
        ]
    }));
}
