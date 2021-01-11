
import { Controller } from '../decorators/controller';
import { Get, Put, Post, Delete } from '../decorators/get';
import { Request, Response } from 'express';
import { ApiResponse } from '../models/responseTypes';

@Controller('/test2')
export default class TestController1 {


	/**
	 * @swagger
	 * /test2:
	 *   get:
	 *     summary: Gets a test value
	 *     operationId: GetTest2
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
		return res.status(200).json(new ApiResponse("Test2 Get Complete"));
	}


	/**
	 * @swagger
	 * /test2/doPut:
	 *   put:
	 *     summary: Gets a test value
	 *     operationId: PutTest2
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


	@Put('/doPut', 'v1', 'v2')
	public doPut(req: Request, res: Response) {
		return res.send(new ApiResponse({value: "Test2 Put Complete", body: req.body }));
	}

	/**
	 * @swagger
	 * /test2/doPost:
	 *   post:
	 *     summary: Gets a test value
	 *     operationId: PostTest2
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


	@Post('/doPost', 'v1', 'v2')
	public doPost(req: Request, res: Response) {
		return res.send(new ApiResponse({value: "Test2 Post Complete", body: req.body }));
	}

	/**
	 * @swagger
	 * /test2/doDelete/{value}:
	 *   delete:
	 *     summary: Gets a test value
	 *     operationId: DeleteTest2
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


	@Delete('/doDelete/{value}', 'v1', 'v2')
	public doDelete(req: Request, res: Response) {
		return res.send(new ApiResponse({value: "Test2 Delete Complete", urlValue: req.params.value }));
	}


}
