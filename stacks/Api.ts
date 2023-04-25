import { Api as ApiGateway, StackContext, use } from "sst/constructs";

export function Api(context: StackContext) {
  const api = new ApiGateway(context.stack, "api", {
    cors: {
      // TODO: Refine CORS config!
      allowMethods: ["GET", "POST", "PUT", "DELETE"],
      allowHeaders: ["*"],
      allowOrigins: ["*"],
    },
    defaults: {
      authorizer: "Authorizer",
    },
  });

  context.stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return api;
}
