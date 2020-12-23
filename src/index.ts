import path from 'path';
import { createApp } from '@app/server';
import { buildAppConfig, buildAppDependencies } from '@app/config';

(async () => {
    const config = await buildAppConfig(path.join(__dirname, 'openapi.yaml'));
    const appDependencies = await buildAppDependencies(config);
    const app = await createApp(appDependencies);

    app.listen(config.serverPort, () => {
        appDependencies.logger.info(`Server started on port: ${config.serverPort}`);
    });
})().catch((err) => {
    // tslint:disable-next-line:no-console
    console.error(err);
});
