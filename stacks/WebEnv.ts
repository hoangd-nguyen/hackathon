import * as ssm from "aws-cdk-lib/aws-ssm";
import { StackContext, use } from "sst/constructs";

import { RestApi } from "./restApi";
import { getSsmPrefix } from "./utils/getSsmPrefix";

export function WebEnv(context: StackContext) {
  const ssmNamePrefix = getSsmPrefix(context);
  const api = use(RestApi);

  const environmentVars = {
    VITE_APP_API_URL: api.url,
    VITE_APP_REGION: context.app.region,
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
