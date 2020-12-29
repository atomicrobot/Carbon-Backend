
/**
 * @swagger
 * components:
 *   schemas:
 *     ApiResponse:
 *       additionalProperties: false
 *       type: object
 *       properties: 
 *         data: 
 *           additionalProperties: false
 *           type: object
 *         errors:
 *           type: array
 *           items:
 *              $ref: '#/components/schemas/ApiError'
 *           maxItems: 1
 *         meta: 
 *           additionalProperties: false
 *           type: object
 */
export class ApiResponse {
	data?: any;
	errors?: ApiError[];
	meta?: any;

	constructor(data?: any, error?: ApiError, errors?: ApiError[], meta?: any) {
		this.data = data;
		this.errors = errors;

		if(!this.errors && error) {
			this.errors = [error];
		}

		this.meta = meta;
	}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ApiError:
 *       additionalProperties: false
 *       type: object
 *       properties: 
 *         message:
 *           pattern: "^.*$"
 *           type: string
 *           maxLength: 1000
 *         detail:
 *           additionalProperties: false
 *           type: object
 *         parent:
 *           additionalProperties: false
 *           type: object
 *       required:
 *         - message
 */
export class ApiError {
	message: string;
	detail?: any;
	parent?: Error;

	constructor(message: string, parent?: Error, detail?: any) {
		this.message = message;
		this.parent = parent;
		this.detail = detail;
	}
}