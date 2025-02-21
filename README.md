## Description

Nodejs backend with Nestjs and Fastify, using monorepo, microservices with rabbitmq, API, websockets, Prisma with postgres, JWT and Role access protection, Test with Jest.
Swagger documentation in: /api/v1/docs.
For test websocket use a client like postman.

This is a example app.
[https://test-api.zero-zone.win](https://test-api.zero-zone.win/api/v1/docs)

## Project setup

Create .env file from .env.example
Configure .env variables.

```bash
$ npm install

# database
$ npx prisma migrate dev
```

## Run the project

```bash
# run api gateway microservice:
$ npm run start:dev api-gateway

# run core microservice:
$ npm run start:dev core

```

## Run tests

```bash
# unit tests
$ npm run test

```

## Deployment in Docker

Check .env variables and docker-compose.yml


```bash
$ docker compose up -d

```

## Stay in touch

- Author - [Adrian Duardo Yanes](https://www.linkedin.com/in/adrian-dy89/)
- Test API - [https://test-api.zero-zone.win](https://test-api.zero-zone.win/api/v1/docs)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
