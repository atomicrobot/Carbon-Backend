
// Modified from: https://github.com/nehalist/ts-decorator-routing
import 'reflect-metadata';
import {HttpMethod, RouteDefinition} from '../models/routeDefinition';

export const Get = (path: string = "", startVersion?: string, deprecatedVersion?: string, removedVersion?: string): MethodDecorator => {
  return (target, propertyKey: any): void => {
    // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
	// To prevent any further validation simply set it to an empty array here.
    if (! Reflect.hasMetadata('routes', target.constructor)) {
      Reflect.defineMetadata('routes', [], target.constructor);
    }

    // Get the routes stored so far, extend it by the new route and re-set the metadata.
    const routes = Reflect.getMetadata('routes', target.constructor) as Array<RouteDefinition>;

    routes.push({
      requestMethod: HttpMethod.Get,
      path,
      methodName: propertyKey,
      startVersion,
      deprecatedVersion,
      removedVersion
    });
    Reflect.defineMetadata('routes', routes, target.constructor);
  };
};

export const Put = (path: string = "", startVersion?: string, deprecatedVersion?: string, removedVersion?: string): MethodDecorator => {
  return (target, propertyKey: any): void => {
    // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
	// To prevent any further validation simply set it to an empty array here.
    if (! Reflect.hasMetadata('routes', target.constructor)) {
      Reflect.defineMetadata('routes', [], target.constructor);
    }

    // Get the routes stored so far, extend it by the new route and re-set the metadata.
    const routes = Reflect.getMetadata('routes', target.constructor) as Array<RouteDefinition>;

    routes.push({
      requestMethod: HttpMethod.Put,
      path,
      methodName: propertyKey,
      startVersion,
      deprecatedVersion,
      removedVersion
    });
    Reflect.defineMetadata('routes', routes, target.constructor);
  };
};

export const Post = (path: string = "", startVersion?: string, deprecatedVersion?: string, removedVersion?: string): MethodDecorator => {
  return (target, propertyKey: any): void => {
    // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
	// To prevent any further validation simply set it to an empty array here.
    if (! Reflect.hasMetadata('routes', target.constructor)) {
      Reflect.defineMetadata('routes', [], target.constructor);
    }

    // Get the routes stored so far, extend it by the new route and re-set the metadata.
    const routes = Reflect.getMetadata('routes', target.constructor) as Array<RouteDefinition>;

    routes.push({
      requestMethod: HttpMethod.Post,
      path,
      methodName: propertyKey,
      startVersion,
      deprecatedVersion,
      removedVersion
    });
    Reflect.defineMetadata('routes', routes, target.constructor);
  };
};

export const Delete = (path: string = "", startVersion?: string, deprecatedVersion?: string, removedVersion?: string): MethodDecorator => {
  return (target, propertyKey: any): void => {
    // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
	// To prevent any further validation simply set it to an empty array here.
    if (! Reflect.hasMetadata('routes', target.constructor)) {
      Reflect.defineMetadata('routes', [], target.constructor);
    }

    // Get the routes stored so far, extend it by the new route and re-set the metadata.
    const routes = Reflect.getMetadata('routes', target.constructor) as Array<RouteDefinition>;

    routes.push({
      requestMethod: HttpMethod.Delete,
      path,
      methodName: propertyKey,
      startVersion,
      deprecatedVersion,
      removedVersion
    });
    Reflect.defineMetadata('routes', routes, target.constructor);
  };
};
