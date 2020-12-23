import supertest from 'supertest';
import path from 'path';
import { StatusCodes } from 'http-status-codes';
import { Response, SuperTest, Test } from 'supertest';

import { createApp } from '@app/server';
import { buildConsoleLogger } from '@util/logger';

describe('Routes', () => {
    const healthCheckPath = '/api/v1/healthcheck';

    let agent: SuperTest<Test>;

    beforeAll(async (done) => {
        const apiSpec = path.join(__dirname, '../../src/openapi.yaml');
        const app = await createApp({
            config: {
                apiSpec,
                buildDate: 'test build date',
                buildSha: 'test build sha',
                buildNumber: 'test build number',
            },
            logger: buildConsoleLogger(),
        } as any);

        agent = supertest.agent(app);
        done();
    });

    describe(`"GET:${healthCheckPath}"`, () => {
        it(`should return a JSON object with a status code of "${StatusCodes.OK}" if the request was successful.`, (done) => {
            agent.get(healthCheckPath)
                .end((err: Error, res: Response) => {
                    expect(err).toBeNull();
                    expect(res.status).toBe(StatusCodes.OK);
                    expect(res.body).toEqual({
                        buildDate: 'test build date',
                        buildSha: 'test build sha',
                        buildNumber: 'test build number'
                    });
                    done();
                });
        });
    });
});