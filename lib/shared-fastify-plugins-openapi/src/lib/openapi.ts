import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

export interface OpenApiPluginOptions {
    env: {
        OPENAPI_TITLE: string;
        OPENAPI_DESCRIPTION: string;
        OPENAPI_VERSION: string;
        OPENAPI_SERVER: string;
        OPENAPI_DOCS_EXPOSED: boolean;
        OPENAPI_PATH: string;
    };
}

export const openApiPlugin = fp(
    async (fastify, options: OpenApiPluginOptions) => {
        fastify.log.debug('Plugin: Setting up OpenAPI');

        await fastify.register(swagger, {
            openapi: {
                info: {
                    title: options.env.OPENAPI_TITLE,
                    description: options.env.OPENAPI_DESCRIPTION,
                    version: options.env.OPENAPI_VERSION,
                },
                servers: [{ url: options.env.OPENAPI_SERVER }],
            },
        });

        if (options.env.OPENAPI_DOCS_EXPOSED) {
            await fastify.register(swaggerUi, {
                routePrefix: options.env.OPENAPI_PATH,
            });
        }
    },
    {
        name: 'openapi',
    },
);
