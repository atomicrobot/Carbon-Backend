import { UserSchema } from './user.schema';
import { ValidationError, parse } from '@project/lib-shared-validation';

describe('UserSchemaSpec', () => {
    function parseUserSchema(data: object): UserSchema {
        return parse<UserSchema>(UserSchema, data);
    }

    it('should require email', () => {
        expect(() => {
            return parseUserSchema({});
        }).toThrow(
            new ValidationError({
                '': ["Must have required property 'email'"],
            }),
        );
    });

    it('should require email an email format', () => {
        expect(() => {
            return parseUserSchema({ email: 'test' });
        }).toThrow(
            new ValidationError({ email: ['Must match format "email"'] }),
        );
    });

    it('should validate a correct user', () => {
        const parsed = parseUserSchema({ email: 'test@test.com' });
        expect(parsed).toEqual({ email: 'test@test.com' });
    });
});
