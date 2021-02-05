import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { StatusCodes } from 'http-status-codes';
import 'express-async-errors';
import { Application } from 'express';
import correlator from 'express-correlation-id';
import responseTime from 'response-time';
import * as OpenApiValidator from 'express-openapi-validator';
import appRoutes from '../routes';
import { buildRequestMetadata } from '@app/app';
import { AppDependencies } from '@app/config';

export async function createApp(dependencies: AppDependencies): Promise<Application> {
    const app = express();
    app.dependencies = dependencies;

    // Track the overall response time of the request
    app.use(responseTime((req, res, time) => {
        res.setHeader('x-response-time-ms', time);
    }));

    // Ensure every request/response has a unique identifier (if not provided by the client) for tracing
    app.use(correlator({ header: 'x-request-id' }));
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.setHeader('x-request-id', correlator.getId() ?? 'not-set');
        next();
    });

    // API HTTP security headers
    app.use(helmet());

    // Adds support for parsing JSON bodies
    app.use(express.json());

    // Capture any common request metadata for route handlers
    app.use((req: Request, res: Response, next: NextFunction) => {
        req.metadata = buildRequestMetadata(req);
        next();
    });

    app.use(
        OpenApiValidator.middleware({
            apiSpec: dependencies.config.apiSpec,
            validateRequests: {
                allowUnknownQueryParameters: false
            },
            validateResponses: {

            }
        }),
    );

    // Application routes
    app.use('/', appRoutes);

    // Supporting automated testing
    if (dependencies.testingRoutes) {
        app.use(dependencies.testingRoutes);
    }

    // Global error handler
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        dependencies.logger.error(err.message, err);
        if (err.status !== undefined) {
            return res.status(err.status).json({
                message: err.message,
            } as Components.Schemas.ApiErrorResponseBody);
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: err.message,
        } as Components.Schemas.ApiErrorResponseBody);
    });

    return app;
}
