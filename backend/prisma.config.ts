import path from 'node:path';
import { defineConfig } from 'prisma/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '.env') });

// Railway may inject the DB url under different variable names
const dbUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_PUBLIC_URL ||
  process.env.POSTGRES_PRISMA_URL;

export default defineConfig({
  datasource: {
    url: dbUrl,
  },
});

export function createAdapter() {
  const pool = new Pool({ connectionString: dbUrl });
  return new PrismaPg(pool);
}
