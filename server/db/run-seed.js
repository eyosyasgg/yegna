import { config } from 'dotenv';
config();

import { initDB } from './init.js';

console.log('Running database initialization...');

initDB().then(() => {
  console.log('Database initialization successful.');
  process.exit(0);
}).catch((error) => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});
