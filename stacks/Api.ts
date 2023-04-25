import { Api as ApiGateway, StackContext, use } from "sst/constructs";

import { Auth } from "./Auth";
import { getCustomDomainConfig } from "./Domain";

export function Api(context: StackContext) {
  const cognito = use(Auth);
  const api = new ApiGateway(context.stack, "api", {
    customDomain: getCustomDomainConfig(context, "api"),
    authorizers: {
      Authorizer: {
        type: "user_pool",
        userPool: {
          id: cognito.userPoolId,
          clientIds: [cognito.userPoolClientId],
        },
      },
    },
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

  cognito.attachPermissionsForAuthUsers(context.stack, [api]);

  context.stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return api;
}
