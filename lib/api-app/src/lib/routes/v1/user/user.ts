import { FastifyPluginAsync } from 'fastify';
import {
    UsersResponse,
    UsersResponseRef,
} from '../../../schemas/routes/user.schema';
import { ensureUserHasRole } from '../../../hooks/authorized';
import { PaginationRequest } from '@project/lib-shared-schemas';

const route: FastifyPluginAsync = async (fastify) => {
    const tags = ['user']; // OpenAPI tags

    await ensureUserHasRole(fastify, 'admin', async (fastify) => {
        fastify.get<{
            Querystring: PaginationRequest;
            Reply: UsersResponse;
        }>(
            '/',
            {
                schema: {
                    tags,
                    querystring: PaginationRequest,
                    response: {
                        200: UsersResponseRef,
                    },
                },
            },
            async function (request) {
                const query = request.query;
                const userService = request.diScope.cradle.userService;
                const result = await userService.findAllUsers({
                    pagination: query,
                });
                return {
                    code: 'OK',
                    statusCode: 200,
                    data: {
                        users: result.data,
                    },
                    pagination: result.pagination,
                };
            },
        );
    });
};

export default route;
