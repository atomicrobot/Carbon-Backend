import { join } from 'path';
import Fastify, { FastifyInstance, RawServerDefault } from 'fastify';
import AutoLoad from '@fastify/autoload';
import { AppOptions, AppEnv } from './config';

import { IncomingMessage, ServerResponse } from 'http';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { schemas } from './schemas';
import {} from '@fastify/awilix';
import { UserService } from './services/userService';
import { Lifetime, asFunction } from 'awilix';
import { Logger } from '@project/lib-shared-logging';

import {
    dependencyInjectionPlugin,
    errorHandlerPlugin,
    httpHeadersPlugin,
    requestLoggingPlugin,
    sensiblePlugin,
    shutdownHandlerPlugin,
} from '@project/lib-shared-fastify-plugins';
import { mongoosePlugin } from '@project/lib-shared-fastify-plugins-mongoose';
import { openApiPlugin } from '@project/lib-shared-fastify-plugins-openapi';

export type AppInstance = FastifyInstance<
    RawServerDefault,
    IncomingMessage,
    ServerResponse<IncomingMessage>,
    Logger,
    TypeBoxTypeProvider
>;

export async function buildApp(options: AppOptions): Promise<AppInstance> {
    options.logger.debug('App: Building app');
    const app: AppInstance = Fastify<
        RawServerDefault,
        IncomingMessage,
        ServerResponse<IncomingMessage>,
        Logger,
        TypeBoxTypeProvider
    >(options).withTypeProvider<TypeBoxTypeProvider>();
    app.decorate('env', options.env);

    app.log.debug('App: Registering schemas');
    for (const schema of schemas) {
        app.addSchema(schema);
    }

    app.log.debug('App: Registering plugins');
    await app.register(sensiblePlugin, options);
    await app.register(shutdownHandlerPlugin, options);
    await app.register(dependencyInjectionPlugin, options);
    await app.register(httpHeadersPlugin, options);
    await app.register(requestLoggingPlugin, options);
    await app.register(errorHandlerPlugin, options);
    await app.register(openApiPlugin, options);
    await app.register(mongoosePlugin, options);

    app.log.debug('App: Registering routes');
    await app.register(AutoLoad, {
        dir: join(__dirname, 'routes'),
        options: options,
    });

    app.log.debug('App: Configuring dependencies');
    await setupDependencyInjection(app);

    options.logger.debug('App: Completed building app');
    return app;
}

async function setupDependencyInjection(app: AppInstance): Promise<void> {
    app.addHook('onRequest', async (request) => {
        request.diScope.register({
            userService: asFunction(() => new UserService(request.log), {
                lifetime: Lifetime.SCOPED,
                dispose: (service) => service.dispose(),
            }),
        });
    });
}

declare module '@fastify/awilix' {
    interface Cradle {
        userService: UserService;
    }
}

declare module 'fastify' {
    export interface FastifyInstance {
        env: AppEnv;
    }
}
