import { SSM } from "aws-sdk";
import { StackContext, StaticSite, use } from "sst/constructs";

import { getSsmPrefix } from "./utils/getSsmPrefix";
import { WebEnv } from "./WebEnv";

export async function Web(context: StackContext) {
  let environmentVars: Record<string, string>;
  if (!process.env.STACK) {
    environmentVars = fetchEnvFromStack();
  } else {
    environmentVars = await fetchEnvFromSsm(context);
  }

  const frontend = new StaticSite(context.stack, "web", {
    path: "web",
    buildCommand: `${generateExportEnvCommandStr(
      environmentVars
    )} npm run build`,
    buildOutput: "dist",
    environment: environmentVars,
  });

  !frontend.url ||
    context.stack.addOutputs({
      frontendUrl: frontend.url,
    });
}

const generateExportEnvCommandStr = (environments: Record<string, string>) => {
  return Object.entries(environments).reduce((commandStr, entry) => {
    commandStr += `export ${entry[0]}=${entry[1]} && `;
    return commandStr;
  }, "");
};

const fetchEnvFromStack = () => {
  return use(WebEnv).reduce((env, entry) => {
    env[entry[0]] = entry[1];
    return env;
  }, {} as Record<string, string>);
};

const fetchEnvFromSsm = async (context: StackContext) => {
  const ssmNamePrefix = getSsmPrefix(context);
  return [
    "VITE_APP_API_URL",
    "VITE_APP_REGION",
  ].reduce(async (env, name) => {
    (await env)[name] = await fetchSsmParam(`${ssmNamePrefix}${name}`);
    return await env;
  }, Promise.resolve({}) as Promise<Record<string, string>>);
};

const fetchSsmParam = async (name: string) => {
  const resp = await new SSM()
    .getParameter({
      Name: name,
    })
    .promise();

  if (!resp.Parameter || !resp.Parameter.Value) {
    throw new Error(`Cannot find ssm parameter ${name}`);
  }
  return resp.Parameter.Value;
};
