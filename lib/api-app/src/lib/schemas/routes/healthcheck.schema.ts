import { BaseResponse } from '@project/lib-shared-schemas';
import { Type, type Static } from '@sinclair/typebox';

export const HealthcheckResponse = Type.Composite(
    [
        BaseResponse(
            Type.Object({
                version: Type.String(),
            }),
        ),
    ],
    { $id: 'HealthcheckResponse', additionalProperties: false },
);
export const HealthcheckResponseRef = Type.Ref(HealthcheckResponse);
export type HealthcheckResponse = Static<typeof HealthcheckResponse>;
