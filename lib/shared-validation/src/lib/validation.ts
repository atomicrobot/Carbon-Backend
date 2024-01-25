import { TSchema } from '@sinclair/typebox';
import addFormats from 'ajv-formats';
import Ajv, { ErrorObject } from 'ajv';

const ajv = addFormats(
    new Ajv({
        removeAdditional: true,
        coerceTypes: true,
        useDefaults: true,
        // Keep this set to false per https://ajv.js.org/security.html
        allErrors: false,
    }),
    [
        'date-time',
        'time',
        'date',
        'email',
        'hostname',
        'ipv4',
        'ipv6',
        'uri',
        'uri-reference',
        'uuid',
        'uri-template',
        'json-pointer',
        'relative-json-pointer',
        'regex',
    ],
);

export function parse<T>(schema: TSchema, data: object): T {
    const validate = ajv.compile<T>(schema);
    if (validate(data)) {
        return data;
    } else {
        const fields = normalizeErrorMessages(validate.errors!);
        throw new ValidationError(fields);
    }
}

export class ValidationError extends Error {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(readonly fields: Record<string, any>) {
        super(JSON.stringify(fields));
    }
}

function normalizeErrorMessages(errors: ErrorObject[]): ValidationError {
    const fields = errors.reduce(function (acc, e) {
        if (e.message === undefined) {
            return acc;
        }

        if (e.instancePath.length && e.instancePath[0] === '/') {
            let path = e.instancePath.slice(1);
            if (Number.isInteger(parseInt(path, 10))) {
                path = `/${path}`;
            }
            acc[path] = [e.message.toUpperCase()[0] + e.message.slice(1)];
        } else {
            acc[e.instancePath] = [
                e.message.toUpperCase()[0] + e.message.slice(1),
            ];
        }
        return acc;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as any);

    return fields;
}
