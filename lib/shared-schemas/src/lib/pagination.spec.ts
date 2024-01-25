import { PaginationRequest } from './pagination';
import { parse, ValidationError } from '@project/lib-shared-validation';

describe('Pagination', () => {
    it('should be able to create a default pagination request', () => {
        expect(parse(PaginationRequest, {})).toEqual({
            limit: 20,
            page: 1,
        });
    });

    it('should not allow a 0 page', () => {
        expect(() =>
            parse(PaginationRequest, {
                page: 0,
            }),
        ).toThrow(ValidationError);
    });

    it('should not allow below a minimum limit', () => {
        expect(() =>
            parse(PaginationRequest, {
                limit: 9,
            }),
        ).toThrow(ValidationError);
    });

    it('should scrub a pagination request', () => {
        expect(
            parse(PaginationRequest, {
                page: 2,
                limit: 10,
                junk: true,
            }),
        ).toEqual({
            page: 2,
            limit: 10,
        });
    });
});
