FROM node:20.11.0-alpine

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN addgroup --system api
RUN adduser --system -G api api

COPY dist/apps/api api
RUN chown -R api:api .

RUN npm --prefix api --omit=dev -f install

CMD [ "node", "api" ]
