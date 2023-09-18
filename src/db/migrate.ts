import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from './env';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

async function migrateDb() {
  const migrationClient = postgres(env.DATABASE_URL, { max: 1 });

  // silence migrate because of the noisy logs
  const consoleLog = console.log;
  console.log = () => {};

  await migrate(drizzle(migrationClient), {
    migrationsFolder: './drizzle'
  });

  console.log = consoleLog;

  await migrationClient.end();
}

void migrateDb();
