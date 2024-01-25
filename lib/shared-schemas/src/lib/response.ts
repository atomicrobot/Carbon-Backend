import { Type, Static, TObject, TRef } from '@sinclair/typebox';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const BaseResponse = <T extends TObject | TRef<TObject>>(T: T) =>
    Type.Object({
        code: Type.Literal('OK'),
        statusCode: Type.Number(),
        data: T,
    });

export const BaseErrorResponse = Type.Object(
    {
        code: Type.Literal('ERROR'),
        statusCode: Type.Number(),
        error: Type.Object(
            {
                reasonCode: Type.String(),
                message: Type.String(),
            },
            { additionalProperties: false },
        ),
    },
    { additionalProperties: false },
);
export type BaseErrorResponse = Static<typeof BaseErrorResponse>;
