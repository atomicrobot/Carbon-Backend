# See: https://cloud.google.com/run/docs/quickstarts/build-and-deploy#containerizing
FROM node:12-slim

WORKDIR /usr/src/app
COPY package*.json ./

COPY . ./

RUN npm ci
RUN npm run-script build

CMD [ "npm", "start" ]