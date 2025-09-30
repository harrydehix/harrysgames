import { sql, type Kysely } from 'kysely';
import { LOBBY_CODE_LENGTH } from './0_create_lobbies';

export const AUTH_TOKEN_LENGTH = 100;

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('players')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(100)', (col) => col.notNull().unique())
    .addColumn('lobby', `varchar(${LOBBY_CODE_LENGTH})`)
    .addColumn('token', `varchar(${AUTH_TOKEN_LENGTH})`, (col) => col.notNull())
    .addForeignKeyConstraint('lobby_foreign', ['lobby'], 'lobbies', ['code'])
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('players').execute();
}
