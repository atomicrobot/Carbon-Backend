import openApiJSDoc from "swagger-jsdoc";

class OpenApiSpec {

	private options: any = {
		definition: {
			openapi: "3.0.3", // Specification (optional, defaults to swagger: '2.0')
			info: {
				title: "API", // Title (required)
				version: "1.0.0", // Version (required)
				description: "NodeJS/Express API"
			},
			components: {
				securitySchemes: {
					OAuth: {
						type: "oauth2",
						flows: {
							implicit: {
								authorizationUrl: "https://ouath2.server.com",
								scopes: {}
							}
						}
					}
				},
				schemas: {
					genericId: {
						type: "string",
						pattern: "\d{10}",
						maxLength: 10,
					},
				},
				responses: {
					errorResponse: {
						description: "Execution Error",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/ApiError"
								}
							}
						}
					},
					defaultResponse: {
						description: "Endpoint",
						content: {
							"text/plain": {
								schema: {
									type: "string",
									pattern: "^.*$",
									maxLength: 9999999,
									// example: "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\"><title>Error</title></head><body><pre>Cannot GET /api/v1/notexists</pre></body></html>"
								}
							}
						}
					}
				},
				headers: {
					XRequestID: {
						description: "Request correlation identifier",
						schema: {
							type: "string"
						},
						required: true
					}
				},
				parameters: {
					XRequestID: {
						name: "X-Request-ID",
						in: "header",
						description: "Request correlation identifier",
						schema: {
							type: "string"
						},
						required: true
					}
				}
			},
			security: [
				{
					// Bearer: [],
					OAuth: []
				}
			],
			servers: [
				{
					url: "https://local.server.com/",
					description: "Local Server"
				},
			],
		},
		// Path to the API docs
		apis: ["./src/**/*.ts"],
	};

	constructor() {
		console.log("Constructing...")
		this.spec = this.initializeOpenApiSpec()
	}

	static instance = new OpenApiSpec();
	private spec: any;

	deprecatePath = (path: string, method: string) => {
		// console.log(`Deprecating Path for ${method} ${path}`);
		if(this.spec.paths[path] && this.spec.paths[path][method]) {
			this.spec.paths[path][method].deprecated = true;
		}
	}

	copyPath = (from: string, to: string, shouldDeprecate: boolean = false) => {
		// console.log("Copying OpenApi path: ", from, to)
		// Do a deep copy of the path
		if(this.spec.paths[from]) {
			this.spec.paths[to] = JSON.parse(JSON.stringify(this.spec.paths[from]));
		}
	}

	removePath = (path: string) => {
		// console.log("Removing OpenApi path: ", path);
		delete this.spec.paths[path];
	}

	getSpec = () => {
		return this.spec;
	}

	// Initialize swagger-jsdoc -> returns validated swagger spec in json format
	private initializeOpenApiSpec = () => {
		// Set the server based on the environment
		const env = 'local'		//TODO: Get this from the config

		if(env?.indexOf("prod") >= 0) {
			this.options.definition.servers = [
				{
					url: "http://production.server.com",
					description: "Local Server"
				}
			];
		} else if(env?.indexOf("stag") >= 0) {
			this.options.definition.servers = [
				{
					url: "https://staging.server.com",
					description: "Staging Server"
				}
			];
		} else if(env?.indexOf("dev") >= 0) {
			this.options.definition.servers = [
				{
					url: "https://dev.server.com/",
					description: "Development Server"
				}
			];
		} else {	//Local
			this.options.definition.servers = [
				{
					url: "http://localhost:3000",
					description: "Local Server"
				}
			];
		}
		return openApiJSDoc(this.options);

	};
}

let openApiSpec = OpenApiSpec.instance;
export default openApiSpec;