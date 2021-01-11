
import { Controller } from '../decorators/controller';
import { Get } from '../decorators/get';
import { Request, Response } from 'express';
import { ApiResponse } from '../models/responseTypes';
import { StatusCodes } from 'http-status-codes';
import { HealthcheckResponseBody } from '../models/healthCheck';

@Controller('/healthcheck')
export default class HealthCheck {

	/**
	 * @swagger
	 * /healthcheck/:
	 *   get:
	 *     tags:
	 *       - api
	 *     responses:
	 *       200:
     *        description: Successful healthcheck response
     *        headers:
     *          X-Request-ID:
     *            $ref: "#/components/headers/XRequestID"
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/HealthcheckResponseBody"
	 */
	@Get('/')
	public getHealthCheck(req: Request, res: Response) {
		res.status(StatusCodes.OK).send({
			buildDate: req.app.dependencies.config.buildDate,
			buildSha: req.app.dependencies.config.buildSha,
			buildNumber: req.app.dependencies.config.buildNumber
		} as HealthcheckResponseBody );
	};
}
