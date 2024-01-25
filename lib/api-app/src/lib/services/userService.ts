import { UserSchema } from '../schemas/domain/user.schema';
import { paginate, UserEntityModel } from '../repositories';
import { Logger } from '@project/lib-shared-logging';
import { PaginationRequest, Pagination } from '@project/lib-shared-schemas';

export class UserService {
    constructor(readonly log: Logger) {}

    dispose(): void {}

    async findAllUsers(options: {
        pagination: PaginationRequest;
    }): Promise<{ data: UserSchema[]; pagination: Pagination }> {
        return await paginate(UserEntityModel.find({}), options);
    }
}
