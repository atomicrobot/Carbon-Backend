import { AppConfig, SetupAppEnvironment } from '@app/config';
import { AppDependencies, AppDependencyBuilder } from '@app/config';
import { buildConsoleLogger } from '@util/logger';

export const setupAppEnvironment: SetupAppEnvironment = async (): Promise<void> => {
    
}

export const dependencyBuilder: AppDependencyBuilder = async (config: AppConfig): Promise<AppDependencies> => {
    return {
        config,
        logger: buildConsoleLogger()
    }
}