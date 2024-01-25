import { Type, type Static } from '@sinclair/typebox';
import { UsersRef } from '../domain/user.schema';
import { PaginationResponse, BaseResponse } from '@project/lib-shared-schemas';

const x = BaseResponse(UsersRef);

export const UsersResponse = Type.Composite([x, PaginationResponse], {
    $id: 'UsersResponse',
    additionalProperties: false,
});
export const UsersResponseRef = Type.Ref(UsersResponse);
export type UsersResponse = Static<typeof UsersResponse>;
