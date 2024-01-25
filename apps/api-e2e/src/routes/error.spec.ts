import { Type } from '@sinclair/typebox';
import { buildTestApp } from '../helper';
import { FastifyInstance } from 'fastify';
import createError from '@fastify/error';

describe('Error Response (e2e)', () => {
    let app: FastifyInstance;

    afterEach(async () => {
        await app.close();
    });

    it('handles bad routes correctly', async () => {
        app = await buildTestApp({});

        const response = await app.inject().get('/does_not_exist');
        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.body)).toEqual({
            code: 'ERROR',
            statusCode: 404,
            error: {
                reasonCode: 'NOT_FOUND',
                message: 'Route GET:/does_not_exist not found',
            },
        });
    });

    it('handles request validation errors correctly', async () => {
        app = await buildTestApp({
            preReady: async (app) => {
                app.get(
                    '/path_required',
                    {
                        schema: {
                            params: Type.Object({
                                x: Type.String(),
                                y: Type.String(),
                            }),
                        },
                    },
                    () => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const bad: any = undefined;
                        bad.nope;
                    },
                );
            },
        });

        const response = await app.inject().get('/path_required');
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body)).toMatchObject({
            code: 'ERROR',
            statusCode: 400,
            error: {
                reasonCode: 'VALIDATION',
                message: "params must have required property 'x'",
            },
        });
    });

    it('handles response validation errors correctly', async () => {
        app = await buildTestApp({
            preReady: async (app) => {
                app.get(
                    '/bad_response',
                    {
                        schema: {
                            response: {
                                200: Type.Object({
                                    x: Type.String(),
                                    y: Type.String(),
                                }),
                            },
                        },
                    },
                    () => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const bad: any = {};
                        return bad;
                    },
                );
            },
        });

        const response = await app.inject().get('/bad_response');
        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body)).toMatchObject({
            code: 'ERROR',
            statusCode: 500,
            error: {
                reasonCode: 'ERROR',
                message: 'Internal Server Error',
            },
        });
    });

    it('handles app errors correctly', async () => {
        const UnauthorizedError = createError(
            'UNAUTHORIZED',
            'Access Denied',
            401,
        );

        app = await buildTestApp({
            preReady: async (app) => {
                app.get('/app_error', {}, () => {
                    throw new UnauthorizedError({ cause: new Error() });
                });
            },
        });

        const response = await app.inject().get('/app_error');
        expect(response.statusCode).toBe(401);
        expect(JSON.parse(response.body)).toMatchObject({
            code: 'ERROR',
            statusCode: 401,
            error: {
                reasonCode: 'UNAUTHORIZED',
                message: 'Access Denied',
            },
        });
    });

    it('handles server errors correctly', async () => {
        app = await buildTestApp({
            preReady: async (app) => {
                app.get('/server_error', {}, () => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const bad: any = undefined;
                    bad.nope;
                });
            },
        });

        const response = await app.inject().get('/server_error');
        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body)).toMatchObject({
            code: 'ERROR',
            statusCode: 500,
            error: {
                reasonCode: 'ERROR',
                message: 'Internal Server Error',
            },
        });
    });
});
