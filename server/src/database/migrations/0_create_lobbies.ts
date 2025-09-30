import { sql, type Kysely } from 'kysely';

export const LOBBY_CODE_LENGTH = 6;

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('lobbies')
    .addColumn('code', `varchar(${LOBBY_CODE_LENGTH})`, (col) =>
      col.primaryKey(),
    )
    .addColumn('name', 'varchar(100)', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('lobbies').execute();
}
