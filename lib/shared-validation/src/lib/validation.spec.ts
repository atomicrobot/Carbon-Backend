import { Type } from '@sinclair/typebox';
import { parse, ValidationError } from './validation';

describe('Validation', () => {
    it('should remove additional fields', () => {
        const testSchema = Type.Object({}, { additionalProperties: false });
        expect(parse(testSchema, { junk: true })).toEqual({});
    });

    it('should coerse types', () => {
        const testSchema = Type.Object(
            {
                intValue: Type.Integer(),
                boolValue: Type.Boolean(),
            },
            { additionalProperties: false },
        );
        expect(parse(testSchema, { intValue: '2', boolValue: 'true' })).toEqual(
            { intValue: 2, boolValue: true },
        );
    });

    it('should fill in defaults', () => {
        const testSchema = Type.Object(
            {
                value: Type.Integer({ default: 42 }),
            },
            { additionalProperties: false },
        );
        expect(parse(testSchema, {})).toEqual({ value: 42 });
    });

    it('should throw only the first validation error', () => {
        const testSchema = Type.Object(
            {
                minValue: Type.Integer({ minimum: 0 }),
                maxValue: Type.Integer({ maximum: 10 }),
            },
            { additionalProperties: false },
        );
        expect(() =>
            parse(testSchema, {
                minValue: -1,
                maxValue: 10,
            }),
        ).toThrow(
            new ValidationError({
                minValue: ['Must be >= 0'],
            }),
        );
    });
});
