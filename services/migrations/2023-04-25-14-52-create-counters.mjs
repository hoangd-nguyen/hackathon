import { Kysely } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createTable("counters")
    .addColumn("key", "text", col => col.primaryKey())
    .addColumn("value", "integer")
    .execute();
  
  await db
    .insertInto("counters")
    .values({
      key: "default",
      value: 0,
    })
    .execute();

  
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema.dropTable("counters").execute();
}
