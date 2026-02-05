import path from 'node:path';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { env } from '../config/env.js';

const client = postgres(env.DATABASE_URL, { max: 1 });
const db = drizzle(client);

await migrate(db, { migrationsFolder: path.join(import.meta.dirname, 'migrations') });

console.log('Migrations complete');
await client.end();
