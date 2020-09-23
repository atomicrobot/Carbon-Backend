#!/usr/bin/env bash

# This script will:
# 1) build a Docker image
# 2) Push it to GCP container registry and tag the new version as 'latest'
# 3) Deploy the latest version to GCP Cloud Run
# 
# And depends on the following environment variable being set prior to running:
# - GCP_PROJECT_NAME - the name of the GCP project
# - GCP_SERVICE_NAME - the name of the GCP Cloud Run service
# - GCP_REGION - the name of the GCP region to deploy the service into
# - GCP_DEPLOY_CREDENTIALS_FILE_NAME - the GCP service account JSON file name stored in Bitrise generic file storage; this service account must have permission to push to Container Registry and deploy to Cloud Run

export DOCKER_IMAGE="gcr.io/${GCP_PROJECT_NAME}/${GCP_SERVICE_NAME}"
export DOCKER_TAG="$DOCKER_IMAGE:${BITRISE_BUILD_NUMBER}"
export GOOGLE_APPLICATION_CREDENTIALS="${GENERIC_FILE_STORAGE}/${GCP_DEPLOY_CREDENTIALS_FILE_NAME}"

# Authenticate with GCP
gcloud auth activate-service-account --key-file="${GOOGLE_APPLICATION_CREDENTIALS}"
gcloud config set project "${GCP_PROJECT_NAME}"
gcloud auth configure-docker

# Build and push a Docker image to Container Registry
docker build -t "${DOCKER_TAG}" .
docker push "${DOCKER_TAG}"
gcloud container images add-tag "${DOCKER_TAG}" "${DOCKER_IMAGE}:latest" --quiet

# Deploy the new (latest) container to Cloud Run automatically
gcloud run deploy "${GCP_SERVICE_NAME}" --platform managed --region "${GCP_REGION}" --image "${DOCKER_TAG}"
