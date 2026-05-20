import path from 'node:path';
import { defineConfig } from 'prisma/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '.env') });

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});

export function createAdapter() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return new PrismaPg(pool);
}
