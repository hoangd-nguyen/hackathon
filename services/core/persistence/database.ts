import { RDSDataService } from "aws-sdk";
import { Kysely } from "kysely";
import { Generated } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import { RDS } from "sst/node/rds";

export interface DatabaseInterface {
  counters: Counters;
}

export const db = new Kysely<DatabaseInterface>({
  // log: ["error", "query"],
  dialect: new DataApiDialect({
    mode: "postgres",
    driver: {
      database: RDS.Cluster.defaultDatabaseName,
      secretArn: RDS.Cluster.secretArn,
      resourceArn: RDS.Cluster.clusterArn,
      client: new RDSDataService(),
    },
  }),
});
/** A Type that converts a DBInterface to API conform type*/
export type FromDbInterface<T extends object> = {
  [K in keyof T]: T[K] extends Generated<infer X> ? X : T[K];
};
interface Counters {
  key: Generated<string>;
  value: number;
}
