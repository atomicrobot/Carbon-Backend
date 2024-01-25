import fp from 'fastify-plugin';
import helmet from '@fastify/helmet';

export interface HttpSecurityPluginOptions {}

export const httpHeadersPlugin = fp(
    async (fastify) => {
        fastify.log.debug('Plugin: Setting up http headers');

        // Secure HTTP response headers
        await fastify.register(helmet, { global: true });

        fastify.addHook('onSend', async (request, reply) => {
            void reply.header('X-Response-ID', request.id);
        });
    },
    {
        name: 'http_headers',
    },
);
