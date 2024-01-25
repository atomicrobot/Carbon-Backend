import { buildTestApp } from '../helper';
import { FastifyInstance } from 'fastify';

describe('RootController (e2e)', () => {
    let app: FastifyInstance;

    beforeEach(async () => {
        try {
            app = await buildTestApp({});
        } catch (err) {
            console.log(err);
        }
    });

    afterEach(async () => {
        await app.close();
    });

    it('/healthcheck (GET)', async () => {
        const response = await app.inject().get('/healthcheck');
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual({
            code: 'OK',
            statusCode: 200,
            data: {
                version: '0.0.0',
            },
        });
    });
});
