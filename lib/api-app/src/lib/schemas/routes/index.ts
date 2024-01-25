import * as paginationSchemas from '@project/lib-shared-schemas';
import * as healthcheckSchemas from './healthcheck.schema';
import * as userSchemas from './user.schema';

export const schemas = [
    ...Object.values(paginationSchemas),
    ...Object.values(healthcheckSchemas),
    ...Object.values(userSchemas),
];
