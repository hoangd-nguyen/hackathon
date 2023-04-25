import { StackContext, use } from "sst/constructs";

import { Api } from "./Api";
import { Database } from "./Database";

export function ApiRoutes(context: StackContext) {
  const api = use(Api);
  const rds = use(Database);

  api.addRoutes(context.stack, {
    "GET /counter": {
      function: {
        handler:
          "services/functions/counters.getCounter",
        bind: [rds],
      },
    },
    
  });
}
