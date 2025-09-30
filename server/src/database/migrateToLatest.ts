import { promises as fs } from 'fs';
import * as path from 'path';
import { Kysely, Migrator, FileMigrationProvider, NO_MIGRATIONS } from 'kysely';
import { Database, postgresDialect } from './database';

export default async function migrateToLatest(fresh = false) {
  const db = new Kysely<Database>({
    dialect: postgresDialect(),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, './migrations'),
    }),
  });

  if (fresh) {
    await migrator.migrateTo(NO_MIGRATIONS);
    console.log('Cleared database!');
  }

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`Migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`Failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('Failed to migrate!');
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
  console.log(
    `Database is up to date! (run ${results?.length ?? 0} migrations)`,
  );
}
