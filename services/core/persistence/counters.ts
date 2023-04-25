import { db } from "./database";

export const getCounter = async (key: string) => {
  return await db
    .selectFrom("counters")
    .select("key")
    .select("value")
    .where("key", "=", key)
    .execute();
};

export const setCounter = async (
  key: string,
  value: number
  ) => {
  return await db
    .updateTable("counters")
    .values({
      key,
      value
    })
    .execute();
};
