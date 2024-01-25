import { TestDatabaseApp } from '../../helper';

describe('UserController (e2e)', () => {
    let testDbApp: TestDatabaseApp;

    beforeEach(async () => {
        testDbApp = await TestDatabaseApp.setup();
    });

    afterEach(async () => {
        await testDbApp.teardown();
    });

    it('/v1/user (GET)', async () => {
        await testDbApp.db.collection('users').insertMany([
            {
                email: 'test@test.com',
            },
        ]);

        const response = await testDbApp.app
            .inject()
            .get('/v1/user')
            .query({ role: 'admin' });
        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        expect(body).toMatchObject({
            code: 'OK',
            statusCode: 200,
            data: {
                users: [{ email: 'test@test.com' }],
            },
        });
    });
});
