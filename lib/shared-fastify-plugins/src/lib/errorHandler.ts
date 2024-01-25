import fp from 'fastify-plugin';
import { FastifyError } from 'fastify';
import { BaseErrorResponse } from '@project/lib-shared-schemas';

export interface ErrorsPluginOptions {}

export const errorHandlerPlugin = fp(
    async (fastify) => {
        fastify.log.debug('Plugin: Setting up error formatting');

        fastify.setNotFoundHandler(async (request, reply) => {
            void reply.status(404);
            return {
                code: 'ERROR',
                statusCode: 404,
                error: {
                    reasonCode: 'NOT_FOUND',
                    message: `Route ${request.method}:${request.url} not found`,
                },
            } satisfies BaseErrorResponse;
        });

        fastify.setErrorHandler(async (error, request, reply) => {
            if (error satisfies FastifyError) {
                const code = 'ERROR';
                const statusCode = error.statusCode ?? 500;
                void reply.status(statusCode);

                const reasonCode = error.validation
                    ? 'VALIDATION'
                    : error.code ?? 'ERROR';
                const message =
                    statusCode === 500
                        ? 'Internal Server Error'
                        : error.message;
                if (statusCode === 500) {
                    const id = request.id;
                    fastify.log.error({
                        err: error,
                        id,
                    });
                }
                return {
                    code,
                    statusCode,
                    error: {
                        reasonCode,
                        message,
                    },
                } satisfies BaseErrorResponse;
            } else {
                fastify.log.fatal(error);
                throw error;
            }
        });
    },
    {
        name: 'errorHandler',
    },
);
