import { ColumnType, Generated, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

export interface Database {
  players: PlayerTable;
  lobbies: LobbyTable;
}

export interface PlayerTable {
  id: Generated<number>;
  name: string;
  token: string;
  created_at: ColumnType<Date, string | undefined, never>;
  lobby?: string;
}

export interface LobbyTable {
  id: Generated<number>;
  code: string;
  name: string;
  created_at: ColumnType<Date, string | undefined, never>;
}

export function postgresDialect() {
  return new PostgresDialect({
    pool: new Pool({
      database: process.env.DATABASE_NAME,
      host: process.env.DATABASE_HOST,
      user: 'postgres',
      password: process.env.DATABASE_PASSWORD,
      port: parseInt(process.env.DATABASE_PORT!),
      max: 30,
    }),
  });
}
