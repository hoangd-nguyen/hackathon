import * as ssm from "aws-cdk-lib/aws-ssm";
import { StackContext, use } from "sst/constructs";

import { Api } from "./Api";
import { Auth } from "./Auth";
import { getSsmPrefix } from "./utils/getSsmPrefix";

export function WebEnv(context: StackContext) {
  const ssmNamePrefix = getSsmPrefix(context);
  const api = use(Api);
  const cognito = use(Auth);

  const environmentVars = {
    VITE_APP_API_URL: api.url,
    VITE_APP_REGION: context.app.region,
    VITE_APP_USER_POOL_ID: cognito.userPoolId,
    VITE_APP_USER_POOL_CLIENT_ID: cognito.userPoolClientId,
  };

  return Object.entries(environmentVars).map((entry) => {
    const name = `${ssmNamePrefix}${entry[0]}`;
    return [
      entry[0],
      new ssm.StringParameter(context.stack, name, {
        parameterName: name,
        stringValue: entry[1],
      }).stringValue,
    ];
  });
}
