import { StackContext } from "sst/constructs";
import { getEnvOrThrow } from "./getEnvOrThrow";

export const getSsmPrefix = ({ app }: StackContext) => {
  if (!process.env.STACK) {
    return `/${app.name}/${app.stage}/`;
  }
  return getEnvOrThrow("SSM_PREFIX");
};
