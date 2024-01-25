import { Query } from 'mongoose';
import { PaginationRequest, Pagination } from '@project/lib-shared-schemas';

export async function paginate<T>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: Query<any, T>,
    options: {
        pagination: PaginationRequest;
    },
): Promise<{ data: T[]; pagination: Pagination }> {
    const page = options.pagination.page;
    const limit = options.pagination.limit;

    const promises: [Promise<T[]>, Promise<number>] = [
        query
            .clone()
            .skip((page - 1) * limit)
            .limit(limit)
            .exec(),
        query.clone().countDocuments(),
    ];
    const [data, count] = await Promise.all(promises);

    const totalPages = Math.ceil(count / limit);
    return {
        data,
        pagination: {
            count,
            totalPages,
            page,
            limit,
        },
    };
}
