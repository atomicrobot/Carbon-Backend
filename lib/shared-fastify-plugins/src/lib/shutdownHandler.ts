import fp from 'fastify-plugin';

import closeWithGrace from 'close-with-grace';

export interface CleanShutdownPluginOptions {}

export const shutdownHandlerPlugin = fp(
    async (fastify) => {
        fastify.log.debug('Plugin: Setting up shutdown handler');

        const closeListeners = closeWithGrace(
            { delay: 250 },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            async function ({ signal, err, manual }) {
                if (err) {
                    fastify.log.error(err);
                }
                await fastify.close();
            },
        );

        fastify.addHook('onClose', async () => {
            closeListeners.uninstall();
        });
    },
    {
        name: 'shutdown_handler',
    },
);
