import { Schema, InferSchemaType, model } from 'mongoose';

const userEntitySchema = new Schema(
    {
        email: { type: String, required: true },
    },
    { timestamps: true },
);
export type UserEntity = InferSchemaType<typeof userEntitySchema>;
export const UserEntityModel = model('users', userEntitySchema);
