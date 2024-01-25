import { Type, Static } from '@sinclair/typebox';
import { BaseResponse, BaseErrorResponse } from './response';
import { parse } from '@project/lib-shared-validation';

describe('Base Responses', () => {
    describe('BaseResponse', () => {
        it('should be able to create a base response', () => {
            const TestSchema = BaseResponse(
                Type.Object({}, { additionalProperties: false }),
            );
            type TestSchema = Static<typeof TestSchema>;

            expect(
                parse(TestSchema, {
                    code: 'OK',
                    statusCode: 200,
                    data: {
                        junk: true,
                    },
                }),
            ).toEqual({
                code: 'OK',
                statusCode: 200,
                data: {},
            });
        });
    });

    describe('BaseErrorResponse', () => {
        it('should be able to create a base error response', () => {
            expect(
                parse(BaseErrorResponse, {
                    code: 'ERROR',
                    statusCode: 400,
                    error: {
                        reasonCode: 'code',
                        message: 'Test failed',
                        junk: true,
                    },
                    junk: true,
                }),
            ).toEqual({
                code: 'ERROR',
                statusCode: 400,
                error: {
                    reasonCode: 'code',
                    message: 'Test failed',
                },
            });
        });
    });
});
