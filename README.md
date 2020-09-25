# Carbon Backend

Features:
- APIs are decleared and validated by OpenAPI
- Automated testing and static analysis built in
- CI/CD ready
- Containerization and cloud integration from deployment to operations and monitoring (reference is for GCP)
- Local IDE and tooling environment configuration (ex: enabling debugging by default) and using Docker Compose to manage dependent services
- Examples of manually testing REST API calls with RESTClient

## Project creation:
`npx express-generator-typescript "project-name"`

## Local Development

### Commands

These commands are where you'll spend 95% of your time.
- `npm install` - Needs to be run once per project and then anytime dependencies change
- `npm run start:dev` - This starts a local server that will restart on code changes
- `npm run test` - This runs automated tests that will rerun on code changes
- `npm outdated` - To show what dependencies can (should!) be upgraded
- If you make changes to `openapi.yaml` and need to codegen (ex: the schema and types changed), run: `./util/codegenOpenAPI.sh`

If you are running the app in 'production' mode, you'll need to run commands in this order to start the server:
- `export GOOGLE_APPLICATION_CREDENTIALS=some_service_account_credentials.json`
- `export GCP_SECRET_MANAGER_CONFIG_RESOURCE_ID=the_identifier_from_secret_manager_in_google_cloud_console`
- `./util/bitrise_UpdateBuildInfo.sh`
- `npm run start`
Note: Logs will not display on the console; they will be visible in Cloud Logging.

If you want to run it in a full container setup (as close as it gets to what it will run like when it is deployed):
- `export GOOGLE_APPLICATION_CREDENTIALS=some_service_account_credentials.json`
- `export GCP_SECRET_MANAGER_CONFIG_RESOURCE_ID=the_identifier_from_secret_manager_in_google_cloud_console`
- `./util/bitrise_UpdateBuildInfo.sh`
- `docker-compose up`
Note: Logs will not display on the console; they will be visible in Cloud Logging.

## Continuous Integration

### Environment variables
- `GIT_CLONE_COMMIT_HASH` (automatically provided by Bitrise)
- `BITRISE_BUILD_NUMBER` (automatically provided by Bitrise)
- `GCP_PROJECT_NAME` - the name of the GCP project
- `GCP_SERVICE_NAME` - the name of the GCP Cloud Run service
- `GCP_REGION` - the name of the GCP region to deploy the service into
- `GCP_DEPLOY_CREDENTIALS_FILE_NAME` - the GCP service account JSON file name stored in Bitrise generic file storage; this service account must have permission to push to Container Registry and deploy to Cloud Run

### Commands
- `npm ci`
- `./util/bitrise_UpdateBuildInfo.sh`
- `npm run build`
- `npm run lint`
- `npm run test:nodebug` (this ensures )
- `./util/bitrise_BuildDeploy_GCPCloudRun.sh`

## GCP

### Configuration

#### Deploying: Container Registry
For each project you will need to enable Container Registry only once.

The following roles are required to push a container to Container Registry (per https://cloud.google.com/container-registry/docs/access-control):
- `Storage Admin`

#### Deploying: Cloud Run
The first time you deploy a service to Cloud Run you'll want to do it in the console so that you have an opportunity to set environment variables, sizes, etc. that will be used on future deploys.

The following roles are required to deploy a container to Cloud Run (per https://cloud.google.com/cloud-build/docs/deploying-builds/deploy-cloud-run):
- `Cloud Run Admin`
- `Service Account User`

#### Running: Logging
The following permissions are required for the service account to write to Cloud Logging:
- `logging.logEntries.create`

#### Running: External configuration
The following permissions are required for the service account to retrieve configurations from Secret Manager:
- `secretmanager.versions.access`

#### Operating: Dynamic Configuration
Any configuration that should change at runtime or by environment should be obtained via environment variables. You'll want to create a new secret in Secret Manager where the content is structured the same as a `.env` file (see the `env` directory). You will need to update your Cloud Run service to include this environment variable `GCP_SECRET_MANAGER_CONFIG_RESOURCE_ID` pointed at the appropriate Secret Manager resource (ex: `projects/yourprojectnumber/secrets/api/versions/latest`).

#### Operating: Logging
Server logging is available in the GCP Console Logs Viewer. 

- You will need to change the selected resource to `Cloud Run Revision` to see logs related to Cloud Run operations (you shouldn't need this often).
- You will need to change the selected resource to `VM Instance` and then filter on the appropriate log destination (ex: `api`) to see application logs.

#### Operating: Monitoring
In the GCP Console go to `Monitoring` and then `Uptime checks`. From here you can enter a URL that will periodically be checked for availability and create an alert if there is no response (ex: sending an email, SMS message, notifying a Slack channel, etc) and configure error thresholds before alerting.
