import { MongoMemoryServer } from 'mongodb-memory-server';

import {
    AppInstance,
    buildApp,
    buildAppOptions,
    AppEnv,
} from '@project/lib-api-app';
import { Db, MongoClient } from 'mongodb';

export { MongoMemoryServer } from 'mongodb-memory-server';
export { MongoClient } from 'mongodb';

export async function buildTestApp(options: {
    env?: Partial<AppEnv>;
    preReady?: (app: AppInstance) => Promise<void>;
}): Promise<AppInstance> {
    const appOptions = buildAppOptions({
        OPENAPI_DOCS_EXPOSED: true,
        LOGGER: 'console',
        ...options.env,
    });
    const app = await buildApp(appOptions);

    if (options.preReady !== undefined) {
        await options.preReady(app);
    }

    await app.ready();
    return app;
}

export async function destroyTestApp(app: AppInstance): Promise<void> {
    await app.close();
}

export async function buildTestDatabase(): Promise<MongoMemoryServer> {
    return await MongoMemoryServer.create();
}

export async function destroyTestDatabase(
    db: MongoMemoryServer,
): Promise<void> {
    await db.stop();
}

export async function buildTestDatabaseClient(
    db: MongoMemoryServer,
): Promise<MongoClient> {
    return await MongoClient.connect(db.getUri());
}

export async function destroyTestDatabaseClient(
    dbClient: MongoClient,
): Promise<void> {
    await dbClient.close();
}

export class TestDatabaseApp {
    static async setup(env?: Partial<AppEnv>): Promise<TestDatabaseApp> {
        const server = await buildTestDatabase();
        const dbClient = await buildTestDatabaseClient(server);
        const db = dbClient.db();
        const app = await buildTestApp({
            env: {
                ...env,
                DATABASE_URI: server.getUri(),
            },
        });
        return new TestDatabaseApp(server, dbClient, db, app);
    }

    constructor(
        readonly server: MongoMemoryServer,
        readonly dbClient: MongoClient,
        readonly db: Db,
        readonly app: AppInstance,
    ) {}

    async teardown(): Promise<void> {
        await this.app.close();
        await this.dbClient.close();
        await this.server.stop();
    }
}
