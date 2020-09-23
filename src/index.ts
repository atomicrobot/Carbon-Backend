import { createApp } from '@server';
import { buildAppConfig, buildAppDependencies } from '@util/app';
import { loadPackagedEnvironmentVariables } from '@util/loadEnvironmentVariables';
import { loadExternalEnvironmentVariables } from '@clients/gcp/secretManager';

(async () => {
    // Load in static environment variables but then allow them to be overridden at start time with an external configuration
    await loadPackagedEnvironmentVariables();
    await loadExternalEnvironmentVariables();

    const config = buildAppConfig();
    const appDependencies = await buildAppDependencies(config);

    const app = await createApp(appDependencies);
    app.listen(config.serverPort, () => {
        appDependencies.logger.info(`Server started on port: ${config.serverPort}`);
    });
})().catch((err) => {
    // tslint:disable-next-line:no-console
    console.error(err);
});
