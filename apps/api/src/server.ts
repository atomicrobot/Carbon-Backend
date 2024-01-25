import { buildApp, buildAppOptions } from '@project/lib-api-app';

(async (): Promise<void> => {
    const env = { ...process.env };
    const options = buildAppOptions(env);
    const fastify = await buildApp(options);

    fastify
        .listen({ host: fastify.env.HOST, port: fastify.env.PORT, ...{} })
        .catch((err) => {
            console.log('Error starting server:', err);
            process.exit(1);
        });
})().catch((err) => {
    console.log('Error building server:', err);
    process.exit(1);
});
