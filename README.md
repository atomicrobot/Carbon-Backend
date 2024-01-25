# Carbon Backend

![Quality Checks](https://github.com/atomicrobot/Carbon-Backend/actions/workflows/quality.yml/badge.svg)

## Architecture

### Tech Stack

- Language: TypeScript (https://www.typescriptlang.org)
- Web Framework: Fastify (https://fastify.dev)
- Logging: Pino (https://getpino.io/#/)
- Validation and Serialization: JSON Schema (https://json-schema.org) via TypeBox (https://github.com/sinclairzx81/typebox)
- Dependency Injection: Awilix (https://github.com/jeffijoe/awilix)
- Unit and Integration Testing: Jest (https://jestjs.io)
- API Documentation: OpenAPI (https://swagger.io/specification/)

### Tooling

- Node Version Manager (https://github.com/nvm-sh/nvm)
- Nx (https://nx.dev/)
- VS Code (https://code.visualstudio.com)
- Docker (https://www.docker.com)

### Motivations and Discussion

- Why is this is setup as a monorepo. We frequently deploy multiple containers, functions, etc and want to easily achieve reuse and standardization of core components across all deployables.
- Core deliverables (ex: `apps/api`) should be thin wrappers and include libraries with the core of the implementation (ex: `lib/api-app`). This faciliates much easier e2e testing (ex: `apps/api-e2e`).
- JSON Schema is used for input validation and output sanitization. This helps to prevent bad data from entering the system and prevent internal information from leaking out unexpectedly.

#### RESTful API Design Guidelines

All API responses have a consistent structure with the following guidelines.

- All responses will be objects.
- All responses will include a `code` attribute at the top of the object that can be used as a discriminator for successful and failed responses.
- All responses will include the HTTP status code as a `statusCode` attribute at the top of the object.
- For successful responses the core data elements should be present in a `data` attribute at the top of the object. The `data` attribute should ALWAYS be an object.
- For unsuccessful responses the error details should be present in an `error` object at the top of the object. That error object should include a `reasonCode` that could be used by software and a `message` that could be displayed to the user.

## Development

### Workflow

- `npm install`: Installs all dependencies
- `npm run clean`: Removes temporary directories (you'll need to run `npm install` again after this command).
- `npm run format`: Formats code to the standard.
- `npm run lint`: Runs code linter.
- `npm run test`: Runs unit tests.
- `npm run test:e2e`: Runs end-to-end tests.
- `npm run serveAll`: Runs all project servers.
- `npm run qualityChecks`: Runs format, lint, test, and test:e2e scripts above.
- `npm run dockerBuild`: Builds any necessary Docker containers.

### Code Style

Automatic VS Code formatters and linting are configured using EditorConfig (https://editorconfig.org) and Prettier (https://prettier.io).

### Reports

Generated code coverage reports can be found in the `coverage` directory.

## Known Issues

- Trying to debug the entire test suite from the testing panel will show `[error] item orta.vscode-jest:carbon-backend-nx is not debuggable`. This is the expected behavior from the extension developer (https://github.com/jest-community/vscode-jest/issues/1056). You can debug individual test files from the testing tree in the same panel or by initiating a debug run in the editor.

- e2e (external) tests will **not** contribute to code coverage. This is not unique to this project or tech stack.

- `npx nx format:write` repeatedly shows `tsconfig.base.json` as being touched even though there are no changes to it. This is a known issue (https://github.com/nrwl/nx/issues/10937) with nx and can be safely ignored.

## TODO

- cloud logging
- infra
- i18n
