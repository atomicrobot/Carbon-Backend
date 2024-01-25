import { FastifyInstance, FastifyPluginAsync } from 'fastify';

// This is NOT a production implementation :-)
export async function ensureUserHasRole(
    fastify: FastifyInstance,
    role: string,
    routePlugin: FastifyPluginAsync,
): Promise<void> {
    fastify.decorateRequest('role');

    fastify.addHook('onRequest', async (request, reply) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        request.role = (request.query as any)?.role;

        if (role !== request.role) {
            await reply.unauthorized('Access Denied');
        }
    });
    await fastify.register(routePlugin);
}

declare module 'fastify' {
    interface FastifyRequest {
        role?: string;
    }
}
