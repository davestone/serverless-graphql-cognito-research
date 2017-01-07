
# Research

A brief piece of research, to have [Serverless](https://github.com/serverless/serverless) hosting a RESTful(ish) authentication API backed by [AWS Cognito](https://aws.amazon.com/cognito/), authorizing a [GraphQL](http://graphql.org/) API for CRUD, persisting to [DynamoDB](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html).

### Setup

(Maybe these can be automated by [AWS Lambda-backed Custom Resources](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources-lambda.html) or AWS will support Cognito eventually)

1. Create Cognito User Pool, `./bin/create_user_pool`
2. In Console, add an App to User Pool which does *not require secret*

### Env Vars

Recommend using [smartcd](https://github.com/cxreg/smartcd) to manage env vars.

- DEBUG: String of Boolean.
- CORS_ACAO: String. URL for CORS Access-Control-Allow-Origin Header.
- DYNAMO_REGION: String. AWS Region, i.e. us-east-1
- COGNITO_USER_POOL_ID: String.
- COGNITO_CLIENT_ID: String.
- COGNITO_REGION: String. AWS Region, i.e. us-east-1

### Usage

#### Install

```
$ npm install                             # tooling
$ cd src
$ npm install                             # deployed modules
```

#### Development

```
$ npm run build                           # build
$ npm run start                           # serve, and monitor all ./src changes
# OR
$ npm run start:src                       # serve, and monitor transpiler changes
```

#### Deploy

```
$ npm run deploy:staging
```
