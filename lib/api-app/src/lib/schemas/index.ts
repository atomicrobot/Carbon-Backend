import { schemas as domainSchemas } from './domain';
import { schemas as dtoSchemas } from './routes';

export const schemas = [
    ...Object.values(domainSchemas),
    ...Object.values(dtoSchemas),
].filter((item) => {
    if (item instanceof Object) {
        if ('$id' in item) {
            return true;
        }
    }

    return false;
});
