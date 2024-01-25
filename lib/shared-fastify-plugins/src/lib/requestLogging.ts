import fp from 'fastify-plugin';

export interface RequestLoggingPluginOptions {}

export const requestLoggingPlugin = fp(
    async (fastify) => {
        fastify.log.debug('Plugin: Setting up request logging');

        fastify.addHook('onRequest', async (req) => {
            req.log.debug({ req }, 'Request');
        });

        fastify.addHook('onResponse', async (req, reply) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const milliseconds = (reply as any).getResponseTime();
            req.log.debug(
                { res: reply, responseTime: milliseconds },
                'Response',
            );
        });
    },
    {
        name: 'request_logging',
    },
);
