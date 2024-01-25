import { Type, type Static } from '@sinclair/typebox';

export const UserSchema = Type.Object(
    {
        email: Type.String({
            format: 'email',
            description: 'User email address.',
        }),
    },
    { $id: 'UserSchema', additionalProperties: false },
);
export const UserRef = Type.Ref(UserSchema);
export type UserSchema = Static<typeof UserSchema>;

export const UsersSchema = Type.Object(
    {
        users: Type.Array(UserRef),
    },
    { $id: 'UsersSchema', additionalProperties: false },
);
export const UsersRef = Type.Ref(UsersSchema);
export type UsersSchema = Static<typeof UsersSchema>;
