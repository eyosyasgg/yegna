import pg from 'pg';
import { config } from 'dotenv';
config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('PG pool error', err);
  process.exit(1);
});

export default pool;
