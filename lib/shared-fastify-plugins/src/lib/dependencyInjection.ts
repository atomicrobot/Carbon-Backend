import fp from 'fastify-plugin';
import { fastifyAwilixPlugin } from '@fastify/awilix';

export interface DependencyInjectionPluginOptions {}

export const dependencyInjectionPlugin = fp(
    async (fastify) => {
        fastify.log.debug('Plugin: Setting up dependency injection');

        await fastify.register(fastifyAwilixPlugin);
    },
    {
        name: 'dependency_injection',
    },
);
