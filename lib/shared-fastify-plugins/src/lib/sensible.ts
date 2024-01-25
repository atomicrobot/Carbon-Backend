import fp from 'fastify-plugin';
import sensible, { SensibleOptions } from '@fastify/sensible';

export const sensiblePlugin = fp<SensibleOptions>(async (fastify) => {
    await fastify.register(sensible);
});
