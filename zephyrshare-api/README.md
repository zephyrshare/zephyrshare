<!--
title: 'Serverless Framework Node Express API service backed by DynamoDB on AWS'
description: 'This template demonstrates how to develop and deploy a simple Node Express API service backed by DynamoDB running on AWS Lambda using the traditional Serverless Framework.'
layout: Doc
framework: v3
platform: AWS
language: nodeJS
priority: 1
authorLink: 'https://github.com/serverless'
authorName: 'Serverless, inc.'
authorAvatar: 'https://avatars1.githubusercontent.com/u/13742415?s=200&v=4'
-->

# Serverless Framework Node Express API on AWS


curl -X POST 'https://jfuusa39s4.execute-api.us-east-1.amazonaws.com/user/signup' --header 'Content-Type: application/json' --data-raw '{"email": "test@test.com", "password": "password!"}'

curl -X POST https://jfuusa39s4.execute-api.us-east-1.amazonaws.com/file/upload -H 'Authorization: Bearer 29632ec6-0497-4c7c-b294-8c0301455190'

curl -X PUT "https://zephyrshare-dev.s3.amazonaws.com/51740bc2-9deb-432b-8af1-28eb5c1c2a09/489a2b1c-efc3-4a0d-b850-e15838cdba5b?AWSAccessKeyId=ASIAQN4S6YSVOEMOY6OA&Expires=1710854209&Signature=8as0Rtxb2jhpUtTKJqZg4JgGj54%3D&X-Amzn-Trace-Id=Root%3D1-65f9822f-3f0bcde421a7fe4d1948270d%3BParent%3D30116af53d2960b8%3BSampled%3D0%3BLineage%3D27ca2ba8%3A0&x-amz-security-token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIGwB5QZz0fZ8OAcbxqeRLOhG5lZR7tHVcZatxCgZh1neAiBIjrqIUlL6I06SKQ0VNJn%2B%2Br1vnT%2B%2FJzrE6yeI7gBNoCqcAwjt%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDAyOTgzNjEwMDc3OCIMPZXCs2vf3FVMWybTKvAC1zgz2UlbOz1tYgM7wd36AlcBCkc3j7bHp%2FToWpdbt%2B5rlbvWSV%2F0TiwGx38imxzHCnMUSA7r1t0PnzhDX424s9p4txCs7lVgMru2s5kUV1%2FRzvK2TPZUOqQ67VklUMK%2BYlUUiQOPXtvkF519oXQaLJUWFyKyklYvZmuEORZQ1t9dj7GFYxs8M8zo%2BFo6A%2FLYtKRpsfsmkodRWC5no81g3C1cLI74EqwnT%2FmVQwc6i6ft%2BUFZMa77pH5g%2B%2BP1tN%2Ftsvs98dK5vMl%2FYniuIIUJ%2Fkpq7EwaGFlcFN%2BhMs%2FyS0zrrDVRtCz6coB2yjvptW3pGViDb1j4mMciMj9MtDe5R%2Fim86eP725J%2BAIERgBywqq5scQ09t1SFiZUzy2FG0MnGknJfdR4rVWVgQ107OCZ2umFaSFavHuEoolTsUkYNJeUG5%2F3uNiDc4A92L%2BesXdQb%2F9i2FargMZebb8cTZO7k%2FVZDODtJc8FjAbPs4%2FFxn0wr4TmrwY6ngG%2BPQi6OdvxaaGcAQJO5bgDmjG0LcXi7U40G9bG30trQMQVuZw76cUxrSSLuNXjRKogPj9masYCfK3SFnkD0AeuuWETzbSGMBN1rnPbhFWmrtgQP2iyl3wQmCluZitHFKqCJbuGsZ9uV8v45jqBSc3Vz9k7OPNqBPw0jivQD7KidQd5Jac4p685BQYA5nrpJKGLrKvC7iNDI3SE0TbtMQ%3D%3D"  --upload-file /Users/andrewheekin/Desktop/IMG_8977.jpeg

curl -X GET "https://jfuusa39s4.execute-api.us-east-1.amazonaws.com/file/download?fileId=489a2b1c-efc3-4a0d-b850-e15838cdba5b" -H 'Authorization: Bearer 29632ec6-0497-4c7c-b294-8c0301455190'

curl -X DELETE "https://jfuusa39s4.execute-api.us-east-1.amazonaws.com/file/489a2b1c-efc3-4a0d-b850-e15838cdba5b" -H 'Authorization: Bearer 29632ec6-0497-4c7c-b294-8c0301455190'



#!/bin/zsh

# Define your variables here
EMAIL="lily@heek.com"
PASSWORD="Passw0rd!"
API_URL="https://jfuusa39s4.execute-api.us-east-1.amazonaws.com/user/signup"

# Execute the curl command with variables
curl -X POST "$API_URL" --header 'Content-Type: application/json' --data-raw "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}"




This template demonstrates how to develop and deploy a simple Node Express API service, backed by DynamoDB database, running on AWS Lambda using the traditional Serverless Framework.


## Anatomy of the template

This template configures a single function, `api`, which is responsible for handling all incoming requests thanks to the `httpApi` event. To learn more about `httpApi` event configuration options, please refer to [httpApi event docs](https://www.serverless.com/framework/docs/providers/aws/events/http-api/). As the event is configured in a way to accept all incoming requests, `express` framework is responsible for routing and handling requests internally. Implementation takes advantage of `serverless-http` package, which allows you to wrap existing `express` applications. To learn more about `serverless-http`, please refer to corresponding [GitHub repository](https://github.com/dougmoscrop/serverless-http). Additionally, it also handles provisioning of a DynamoDB database that is used for storing data about users. The `express` application exposes two endpoints, `POST /users` and `GET /user/{userId}`, which allow to create and retrieve users.

## Usage

### Deployment

Install dependencies with:

```
npm install
```

and then deploy with:

```
serverless deploy
```

After running deploy, you should see output similar to:

```bash
Deploying aws-node-express-dynamodb-api-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-express-dynamodb-api-project-dev (196s)

endpoint: ANY - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
functions:
  api: aws-node-express-dynamodb-api-project-dev-api (766 kB)
```

_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [`httpApi` event docs](https://www.serverless.com/framework/docs/providers/aws/events/http-api/). Additionally, in current configuration, the DynamoDB table will be removed when running `serverless remove`. To retain the DynamoDB table even after removal of the stack, add `DeletionPolicy: Retain` to its resource definition.

### Invocation

After successful deployment, you can create a new user by calling the corresponding endpoint:

```bash
curl --request POST 'https://jfuusa39s4.execute-api.us-east-1.amazonaws.com/users' --header 'Content-Type: application/json' --data-raw '{"name": "John", "userId": "someUserId"}'
```

Which should result in the following response:

```bash
{"userId":"someUserId","name":"John"}
```

You can later retrieve the user by `userId` by calling the following endpoint:

```bash
curl https://jfuusa39s4.execute-api.us-east-1.amazonaws.com/users/someUserId
```

Which should result in the following response:

```bash
{"userId":"someUserId","name":"John"}
```

If you try to retrieve user that does not exist, you should receive the following response:

```bash
{"error":"Could not find user with provided \"userId\""}
```

### Local development

It is also possible to emulate DynamoDB, API Gateway and Lambda locally using the `serverless-dynamodb-local` and `serverless-offline` plugins. In order to do that, run:

```bash
serverless plugin install -n serverless-dynamodb-local
serverless plugin install -n serverless-offline
```

It will add both plugins to `devDependencies` in `package.json` file as well as will add it to `plugins` in `serverless.yml`. Make sure that `serverless-offline` is listed as last plugin in `plugins` section:

```
plugins:
  - serverless-dynamodb-local
  - serverless-offline
```

You should also add the following config to `custom` section in `serverless.yml`:

```
custom:
  (...)
  dynamodb:
    start:
      migrate: true
    stages:
      - dev
```

Additionally, we need to reconfigure `AWS.DynamoDB.DocumentClient` to connect to our local instance of DynamoDB. We can take advantage of `IS_OFFLINE` environment variable set by `serverless-offline` plugin and replace:

```javascript
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
```

with the following:

```javascript
const dynamoDbClientParams = {};
if (process.env.IS_OFFLINE) {
  dynamoDbClientParams.region = 'localhost'
  dynamoDbClientParams.endpoint = 'http://localhost:8000'
}
const dynamoDbClient = new AWS.DynamoDB.DocumentClient(dynamoDbClientParams);
```

After that, running the following command with start both local API Gateway emulator as well as local instance of emulated DynamoDB:

```bash
serverless offline start
```

To learn more about the capabilities of `serverless-offline` and `serverless-dynamodb-local`, please refer to their corresponding GitHub repositories:
- https://github.com/dherault/serverless-offline
- https://github.com/99x/serverless-dynamodb-local
