import {
    HealthcheckResponse,
    HealthcheckResponseRef,
} from '../schemas/routes/healthcheck.schema';
import { FastifyPluginAsync } from 'fastify';

const route: FastifyPluginAsync = async (fastify) => {
    const tags = ['healthcheck']; // OpenAPI tags

    fastify.get<{ Reply: HealthcheckResponse }>(
        '/healthcheck',
        {
            schema: {
                tags,
                response: {
                    200: HealthcheckResponseRef,
                },
            },
        },
        async function () {
            return {
                code: 'OK',
                statusCode: 200,
                data: {
                    version: this.env.SERVICE_VERSION,
                },
            };
        },
    );
};

export default route;
