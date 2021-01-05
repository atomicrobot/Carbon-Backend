import express, { Request, Response, NextFunction, Router } from 'express';
import helmet from 'helmet';
import { StatusCodes } from 'http-status-codes';
import 'express-async-errors';
import { Application } from 'express';
import correlator from 'express-correlation-id';
import responseTime from 'response-time';
import * as OpenApiValidator from 'express-openapi-validator';
import { buildRequestMetadata } from '@app/app';
import { AppDependencies } from '@app/config';
import 'reflect-metadata';

import { HttpMethod, RouteDefinition, apiVersions } from '../models/routeDefinition';

import swaggerUi from "swagger-ui-express";
import openApiSpec from "../openApi/openApiSpec";

import TestController1 from '../controllers/TestController1';
import TestController2 from '../controllers/TestController2';
import HealthCheck from '../controllers/HealthCheck';
import { Http } from 'winston/lib/winston/transports';
import { ApiError } from '@models/responseTypes';


export async function createApp(dependencies: AppDependencies): Promise<Application> {
    const app = express() as any;
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

    console.log("Setting routes...");

    console.log("Done setting routes");

    // Supporting automated testing
    if (dependencies.testingRoutes) {
        app.use(dependencies.testingRoutes);
    }



    // Modified from: https://github.com/nehalist/ts-decorator-routing
    // Iterate over all our controllers and register our routes

    let router = Router();

    [

        HealthCheck,
        TestController1,
        TestController2,

    ].forEach(controller => {
        // This is our instantiated class
        const instance: any                  = new controller();
        // The prefix saved to our controller
        const prefix                         = Reflect.getMetadata('prefix', controller);
        // Our `routes` array containing all our routes for this controller
        const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller);

        // Iterate over all routes and register them to our express application 
        routes.forEach(route => {

            let swaggerPath = `${prefix}${route.path}`;

            let shouldAdd = false;
            let isDeprecated = false;
            let method = route.requestMethod;

            for(let version of apiVersions) {

                //Start adding at startVersion, or add to all is startVersion is null/undefined
                if(route.startVersion == undefined || route.startVersion == null || route.startVersion == version) {
                    shouldAdd = true;
                }

                //Mark as deprecated if version is route.deprecatedVersion; retains flag for subsequent versions
                if(route.deprecatedVersion && route.deprecatedVersion == version) {
                    isDeprecated = true;
                }

                //Don't add it on or after the removedVersion
                if(route.removedVersion && route.removedVersion == version) {
                    shouldAdd = false;
                }
                
                if(shouldAdd) {
                    // convert path style /somePath/{someVar} to /somePath/:someVar
                    const newSwaggerPath = `/${version}/${swaggerPath}`.replace(/\/\//g, '/');
                    
                    let convertedRoute = newSwaggerPath.replace(/\{/g, ':').replace(/\}/g, '');

                    openApiSpec.copyPath(`${swaggerPath}`, newSwaggerPath);

                    if(isDeprecated) {
                        openApiSpec.deprecatePath(newSwaggerPath, route.requestMethod);
                    }

                    console.log(`Creating Route: ${route.requestMethod} ${convertedRoute} (${swaggerPath}) [${newSwaggerPath}]`);

                    let action = (req: Request, res: Response, next: any) => {
                        console.log(`Executing Route: ${route.requestMethod} ${convertedRoute}`);
                        // Execute our method for this path and pass our express request and response object.
                        instance[route.methodName](req, res, next);
                    }

                    //Add routes to the router; then routes are added after setting OpenAPI
                    switch(method) {
                    case HttpMethod.Get:
                        router.get(convertedRoute, action);
                        break;
                    case HttpMethod.Put:
                        router.put(convertedRoute, action);
                        break;
                    case HttpMethod.Post:
                        router.post(convertedRoute, action);
                        break;
                    case HttpMethod.Delete:
                        router.delete(convertedRoute, action);
                        break;
                    }

                }
            }

            openApiSpec.removePath(swaggerPath);

        });
    });

    //TODO: Only allow OpenApi to be loaded in DEV
    //Set up and serve OpenApi spec
    app.get("/api-docs.json", (_req: any, res: any) => {
        res.setHeader("Content-Type", "application/json");
        res.send(openApiSpec.getSpec());
    });

    let doc = swaggerUi.setup(openApiSpec.getSpec())

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec.getSpec()));

    app.use(
        OpenApiValidator.middleware({
            apiSpec: openApiSpec.getSpec() as any,
            validateRequests: {
                allowUnknownQueryParameters: false
            },
            validateResponses: false
        })
    );


    app.use('/', router);

    // Global error handler
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        dependencies.logger.error(err.message, err);
        if (err.status !== undefined) {
            return res.status(err.status).json(new ApiError(err.message));
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ApiError(err.message));
    });

    return app;
}
