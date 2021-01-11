
import { Controller } from '../decorators/controller';
import { Get } from '../decorators/get';
import { Request, Response } from 'express';
import { ApiResponse } from '../models/responseTypes';

@Controller('/test1')
export default class TestController1 {


	/**
	 * @swagger
	 * /test1:
	 *   get:
	 *     summary: Gets a test value
	 *     operationId: GetTest1
	 *     responses:
	 *       200:
	 *         description: ''
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ApiResponse'
	 *       400:
	 *         $ref: '#/components/responses/errorResponse'
	 *       default:
	 *         $ref: '#/components/responses/defaultResponse'
	 */

	@Get('', 'v1')
	public index(req: Request, res: Response) {
		return res.status(200).json({"abc": "def"});
		//new ApiResponse("Test1 Index")
	}


	/**
	 * @swagger
	 * /test1/second:
	 *   get:
	 *     summary: Gets a test value
	 *     operationId: GetTest1
	 *     responses:
	 *       200:
	 *         description: ''
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ApiResponse'
	 *       400:
	 *         $ref: '#/components/responses/errorResponse'
	 *       default:
	 *         $ref: '#/components/responses/defaultResponse'
	 */


	@Get('/second', 'v1', 'v2')
	public second(req: Request, res: Response) {
		return res.send(new ApiResponse({value: "Test1 Second" }));
	}

	/**
	 * @swagger
	 * /test1/third/{value}:
	 *   get:
	 *     summary: Gets a test value
	 *     operationId: GetTest1
	 *     parameters:
	 *     - name: value
	 *       in: path
	 *       description: Value to return
	 *       required: true
	 *       schema:
	 *         type: number
	 *     responses:
	 *       200:
	 *         description: ''
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ApiResponse'
	 *       400:
	 *         $ref: '#/components/responses/errorResponse'
	 *       default:
	 *         $ref: '#/components/responses/defaultResponse'
	 */
	@Get('/third/{value}', 'v1', 'v2', 'v3')
	public withValue(req: Request, res: Response) {
		return res.send(new ApiResponse( { testValue: req.params.value }));
	}


	/**
	 * @swagger
	 * /test1/fourth/{value}:
	 *   get:
	 *     summary: Gets a test value
	 *     operationId: GetTest1
	 *     parameters:
	 *     - name: value
	 *       in: path
	 *       description: Value to return
	 *       required: true
	 *       schema:
	 *         type: number
	 *     responses:
	 *       200:
	 *         description: ''
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ApiResponse'
	 *       400:
	 *         $ref: '#/components/responses/errorResponse'
	 *       default:
	 *         $ref: '#/components/responses/defaultResponse'
	 */
	@Get('/fourth/{value}', 'v3.1-beta1')
	public fouthWithValue(req: Request, res: Response) {
		return res.send(new ApiResponse( { testValue: req.params.value }));
	}
}