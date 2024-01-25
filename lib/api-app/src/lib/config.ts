import { v4 as uuidv4 } from 'uuid';
import { FastifyServerOptions } from 'fastify';
import { Type, type Static } from '@sinclair/typebox';

import { Logger, buildLogger } from '@project/lib-shared-logging';
import { parse } from '@project/lib-shared-validation';
import { SensibleOptions } from '@fastify/sensible';

import { DatabasePluginOptions } from '@project/lib-shared-fastify-plugins-mongoose';
import { OpenApiPluginOptions } from '@project/lib-shared-fastify-plugins-openapi';

export interface AppOptions
    extends FastifyServerOptions,
        SensibleOptions,
        DatabasePluginOptions,
        OpenApiPluginOptions {
    env: AppEnv;
    logger: Logger;
}

export function buildAppOptions(data: object): AppOptions {
    const env = parse<AppEnv>(AppEnv, data);
    const logger = buildLogger({ env: env });
    return {
        requestIdHeader: 'X-Request-ID',
        genReqId: () => uuidv4(),
        env,
        logger,
        disableRequestLogging: true,
    };
}

const AppEnv = Type.Object({
    SERVICE_NAME: Type.String({ default: 'api' }),
    SERVICE_DESCRIPTION: Type.String({ default: 'API Service' }),
    SERVICE_VERSION: Type.String({ default: '0.0.0' }),
    //
    HOST: Type.String({ default: '127.0.0.1' }),
    PORT: Type.Number({ default: 3000 }),
    //
    DATABASE_URI: Type.String({ default: '' }),
    //
    LOGGER: Type.Union([Type.Literal('system'), Type.Literal('console')], {
        default: 'system',
    }),
    LOG_LEVEL: Type.Union(
        [
            Type.Literal('silent'),
            Type.Literal('fatal'),
            Type.Literal('error'),
            Type.Literal('warn'),
            Type.Literal('info'),
            Type.Literal('trace'),
            Type.Literal('debug'),
        ],
        { default: 'info' },
    ),
    //
    OPENAPI_DOCS_EXPOSED: Type.Boolean({ default: false }),
    OPENAPI_PATH: Type.String({ default: '/docs' }),
    OPENAPI_SERVER: Type.String({ default: 'http://127.0.0.1:3000' }),
    OPENAPI_TITLE: Type.String({ default: 'OpenAPI' }),
    OPENAPI_DESCRIPTION: Type.String({ default: 'OpenAPI Specification' }),
    OPENAPI_VERSION: Type.String({ default: '0.0.0' }),
});
export type AppEnv = Static<typeof AppEnv>;
