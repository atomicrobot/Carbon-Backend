import { connect, disconnect, ConnectOptions } from 'mongoose';
import fp from 'fastify-plugin';

export interface DatabasePluginOptions {
    env: {
        DATABASE_URI: string;
    };
    databaseConnectOptions?: ConnectOptions;
}

export const mongoosePlugin = fp(
    async (fastify, options: DatabasePluginOptions) => {
        if (options.env.DATABASE_URI !== '') {
            fastify.log.debug('Plugin: Setting up mongoose');

            fastify.addHook('onClose', async () => {
                fastify.log.debug('Plugin: Disconnecting mongoose');
                await disconnect();
            });

            await connect(
                options.env.DATABASE_URI,
                options.databaseConnectOptions,
            );
        } else {
            fastify.log.debug('Plugin: Skipping mongoose setup');
        }
    },
    {
        name: 'mongoose',
    },
);
