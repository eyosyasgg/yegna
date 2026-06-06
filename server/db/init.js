import bcrypt from 'bcryptjs';
import pool from './database.js';

export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      bio TEXT DEFAULT '',
      location TEXT DEFAULT '',
      language TEXT DEFAULT 'both',
      mode TEXT DEFAULT '',
      match_status TEXT DEFAULT 'none',
      match_id INTEGER REFERENCES users(id),
      current_streak INTEGER DEFAULT 0,
      longest_streak INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS goals (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      mode TEXT NOT NULL,
      category TEXT DEFAULT '',
      description TEXT DEFAULT '',
      duration_days INTEGER DEFAULT 0,
      daily_commitment TEXT DEFAULT '',
      location TEXT DEFAULT '',
      date_from TEXT DEFAULT '',
      date_to TEXT DEFAULT '',
      interests TEXT DEFAULT '[]',
      openness_level INTEGER DEFAULT 3,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS checkins (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      mood INTEGER NOT NULL CHECK(mood >= 1 AND mood <= 5),
      note TEXT DEFAULT '',
      checkin_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, checkin_date)
    );

    CREATE TABLE IF NOT EXISTS matches (
      id SERIAL PRIMARY KEY,
      user_1_id INTEGER REFERENCES users(id),
      user_2_id INTEGER REFERENCES users(id),
      mode TEXT NOT NULL,
      started_at TIMESTAMP DEFAULT NOW(),
      status TEXT DEFAULT 'active'
    );
  `);

  const { rows } = await pool.query('SELECT COUNT(*) as cnt FROM users');
  if (rows[0].cnt > 0) {
    console.log('DB already seeded, skipping.');
    return;
  }

  const hash1 = bcrypt.hashSync('password123', 10);
  const hash2 = bcrypt.hashSync('password123', 10);
  const hash3 = bcrypt.hashSync('password123', 10);

  const today = new Date();
  const strToday = today.toISOString().split('T')[0];

  const r1 = await pool.query(
    `INSERT INTO users (name, email, password_hash, mode, location, language, match_status, current_streak)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
    ['Aisha Tadesse', 'test1@yegna.com', hash1, 'commit', 'Addis Ababa', 'both', 'matched', 5]
  );
  const uid1 = r1.rows[0].id;

  const r2 = await pool.query(
    `INSERT INTO users (name, email, password_hash, mode, location, language, match_status, current_streak)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
    ['Bereket Haile', 'test2@yegna.com', hash2, 'commit', 'Addis Ababa', 'amharic', 'matched', 5]
  );
  const uid2 = r2.rows[0].id;

  await pool.query(
    `INSERT INTO users (name, email, password_hash, mode, location, language, match_status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    ['Selam Girma', 'test3@yegna.com', hash3, 'explore', 'Addis Ababa', 'english', 'pending']
  );

  await pool.query('INSERT INTO matches (user_1_id, user_2_id, mode) VALUES ($1, $2, $3)', [uid1, uid2, 'commit']);
  await pool.query('UPDATE users SET match_id = $1 WHERE id = $2', [uid2, uid1]);
  await pool.query('UPDATE users SET match_id = $1 WHERE id = $2', [uid1, uid2]);

  await pool.query(
    'INSERT INTO goals (user_id, mode, category, duration_days) VALUES ($1, $2, $3, $4)',
    [uid1, 'commit', 'Fitness', 90]
  );
  await pool.query(
    'INSERT INTO goals (user_id, mode, category, duration_days) VALUES ($1, $2, $3, $4)',
    [uid2, 'commit', 'Fitness', 90]
  );

  const moods = [3, 4, 5, 4, 4];
  for (let i = 4; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    await pool.query(
      'INSERT INTO checkins (user_id, mood, note, checkin_date) VALUES ($1, $2, $3, $4::DATE)',
      [uid1, moods[i], `Day ${5 - i} check-in`, dateStr]
    );
    await pool.query(
      'INSERT INTO checkins (user_id, mood, note, checkin_date) VALUES ($1, $2, $3, $4::DATE)',
      [uid2, moods[i], `Day ${5 - i} check-in`, dateStr]
    );
  }

  console.log('DB initialized and seeded.');
}
