import * as sst from 'sst/constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Database } from './database';
import { DatabaseMigrations } from './databaseMigrations';
import { Layers } from './layers';
import { Network } from './network';
import { RestApi } from './restApi';
import { WebEnv } from './WebEnv';
import { Web } from './Web';

// deal with dynamic imports of node built-ins (e.g. "crypto")
// from https://github.com/evanw/esbuild/pull/2067#issuecomment-1073039746
// and hardcode __dirname for https://github.com/prisma/prisma/issues/14484
export const ESM_REQUIRE_SHIM = `await(async()=>{let{dirname:e}=await import("path"),{fileURLToPath:i}=await import("url");if(typeof globalThis.__filename>"u"&&(globalThis.__filename=i(import.meta.url)),typeof globalThis.__dirname>"u"&&(globalThis.__dirname='/var/task'),typeof globalThis.require>"u"){let{default:a}=await import("module");globalThis.require=a.createRequire(import.meta.url)}})();`;

export const RUNTIME = Runtime.NODEJS_18_X;
const BACKEND_STACK_NAME = "backend";
const FRONTEND_STACK_NAME = "frontend";

export default async function main(app: sst.App) {
  app.setDefaultFunctionProps({
    runtime: 'nodejs18.x',

    // N.B. bundle settings are defined in Layers
  });

  // https://github.com/serverless-stack/sst/issues/1674#issuecomment-1140295474
    // The whole infrastructure can only be deployed using sst start
    // Split backend and frontend into 2 independent stacks and we can build and deploy separately
    const stack = process.env.STACK;
    if (!stack) {
      await app
        .stack(Network)
        .stack(Layers)
        .stack(Database)
        .stack(DatabaseMigrations)
        .stack(RestApi)
        .stack(WebEnv)
        .stack(Web);
    } else if (stack === FRONTEND_STACK_NAME) {
      await app.stack(Web);
    } else if (stack === BACKEND_STACK_NAME) {
      app
        .stack(Network)
        .stack(Layers)
        .stack(Database)
        .stack(DatabaseMigrations)
        .stack(RestApi)
        .stack(WebEnv)
    } else {
      throw new Error("Unknown stack name");
    }
}
