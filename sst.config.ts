import { RemovalPolicy } from "aws-cdk-lib";
import { SSTConfig } from "sst";

import { Api } from "./stacks/Api.js";
import { ApiRoutes } from "./stacks/ApiRoutes.js";
import { Auth } from "./stacks/Auth";
import { Database } from "./stacks/Database.js";
import { Web } from "./stacks/Web";
import { WebEnv } from "./stacks/WebEnv";

const PROJECT_NAME = "hackathon";
const AWS_REGION = "eu-central-1";
const DEFAULT_RUNTIME = "nodejs16.x";

const DB_STACK_NAME = "backend";
const BACKEND_STACK_NAME = "backend";
const FRONTEND_STACK_NAME = "frontend";

export default {
  config(input) {
    const PROFILE: Record<string, string> = {
      local: "local",
      default: input.stage || "local",
    };
    return {
      name: PROJECT_NAME,
      region: AWS_REGION,
      profile: input.stage || "local",
    };
  },
  async stacks(app) {
    app.setDefaultFunctionProps({
      runtime: DEFAULT_RUNTIME,
    });

    if (app.stage !== "production" && app.stage !== "preview") {
      app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
    }

    // https://github.com/serverless-stack/sst/issues/1674#issuecomment-1140295474
    // The whole infrastructure can only be deployed using sst start
    // Split backend and frontend into 2 independent stacks and we can build and deploy separately
    const stack = process.env.STACK;
    if (!stack) {
      await app
        .stack(Database)
        .stack(Auth)
        .stack(Api)
        .stack(ApiRoutes)
        .stack(WebEnv)
        .stack(Web);
    } else if (stack === FRONTEND_STACK_NAME) {
      await app.stack(Web);
    } else if (stack === BACKEND_STACK_NAME) {
      app
        .stack(Database)
        .stack(Auth)
        .stack(Api)
        .stack(ApiRoutes)
        .stack(WebEnv);
    } else {
      throw new Error("Unknown stack name");
    }
  },
} satisfies SSTConfig;
