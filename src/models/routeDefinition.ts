// Modified from: https://github.com/nehalist/ts-decorator-routing

export enum HttpMethod {
	Get = 'get',
	Post = 'post',
	Delete = 'delete',
	Put = 'put',
}

export interface RouteDefinition {
	// Path to our route
	path: string;
	// HTTP Request method (get, post, ...)
	requestMethod: HttpMethod;
	// Method name within our class responsible for this route
	methodName: string;
	startVersion?: string;
	deprecatedVersion?: string;
	removedVersion?: string;
}

export let apiVersions = ["v1", "v2", "v3", "v3.1-beta1", "v3.1"];