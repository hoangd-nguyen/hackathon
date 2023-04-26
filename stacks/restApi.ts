import { Api, StackContext } from 'sst/constructs';

export function RestApi({ stack }: StackContext) {
  const api = new Api(stack, 'RestApi', {
    defaults: { function: { timeout: '10 seconds' } },
    routes: {
      "POST /generate-users": {
        function: {
          handler:
            "backend/src/functions/users.generateUsers",
        },
      },

      "GET /users": {
        function: {
          handler:
            "backend/src/functions/users.getUsers",
        },
      }
    }, // can add HTTP routes here - https://docs.serverless-stack.com/constructs/Api#using-the-minimal-config
  });
  stack.addOutputs({
    RestApiEndpoint: api.url,
  });
  return api;
}
