import { Type, type Static } from '@sinclair/typebox';

export const PaginationRequest = Type.Object(
    {
        page: Type.Number({
            minimum: 1,
            default: 1,
        }),
        limit: Type.Number({
            minimum: 10,
            default: 20,
        }),
    },
    { $id: 'PaginationRequest', additionalProperties: false },
);
export type PaginationRequest = Static<typeof PaginationRequest>;

export const Pagination = Type.Object(
    {
        count: Type.Number({
            minimum: 0,
        }),
        totalPages: Type.Number({
            minimum: 0,
        }),
        page: Type.Number({
            minimum: 0,
        }),
        limit: Type.Number({
            minimum: 0,
        }),
    },
    { additionalProperties: false },
);
export type Pagination = Static<typeof Pagination>;

export const PaginationResponse = Type.Object(
    {
        pagination: Pagination,
    },
    { $id: 'PaginationResponse', additionalProperties: false },
);
export type PaginationResponse = Static<typeof PaginationResponse>;
