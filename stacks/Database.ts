import { RDS, StackContext } from "sst/constructs";

export function Database({ stack }: StackContext) {
  const cluster = new RDS(stack, "Cluster", {
    engine: "postgresql11.13",
    defaultDatabaseName: "CounterDB",
    migrations: "services/migrations",
  });

  stack.addOutputs({
    SecretArn: cluster.secretArn,
    ClusterIdentifier: cluster.clusterIdentifier,
  });

  return cluster;
}
