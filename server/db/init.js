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
      completed_goals INTEGER DEFAULT 0,
      completed_tasks INTEGER DEFAULT 0,
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
      status TEXT DEFAULT 'active',
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS checkins (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      goal_id INTEGER REFERENCES goals(id),
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
      goal_id INTEGER REFERENCES goals(id),
      status TEXT DEFAULT 'active',
      started_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS badges (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      icon TEXT DEFAULT '🏆',
      earned_at TIMESTAMP DEFAULT NOW()
    );
  `);

  try {
    await pool.query(`ALTER TABLE users ADD COLUMN completed_goals INTEGER DEFAULT 0`);
  } catch {}
  try {
    await pool.query(`ALTER TABLE users ADD COLUMN completed_tasks INTEGER DEFAULT 0`);
  } catch {}
  try {
    await pool.query(`ALTER TABLE goals ADD COLUMN status TEXT DEFAULT 'active'`);
  } catch {}
  try {
    await pool.query(`ALTER TABLE checkins ADD COLUMN goal_id INTEGER REFERENCES goals(id)`);
  } catch {}
  try {
    await pool.query(`ALTER TABLE matches ADD COLUMN goal_id INTEGER REFERENCES goals(id)`);
  } catch {}

  const { rows } = await pool.query('SELECT COUNT(*) as cnt FROM users');
  if (rows[0].cnt > 0) {
    console.log('DB already seeded, skipping.');
    return;
  }

  const hash = (s) => bcrypt.hashSync(s, 10);

  const r1 = await pool.query(
    `INSERT INTO users (name, email, password_hash, mode, location, language, match_status, current_streak, longest_streak, completed_goals, completed_tasks)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
    ['Aisha Tadesse', 'test1@yegna.com', hash('password123'), 'commit', 'Addis Ababa', 'both', 'matched', 5, 12, 2, 45]
  );
  const uid1 = r1.rows[0].id;

  const r2 = await pool.query(
    `INSERT INTO users (name, email, password_hash, mode, location, language, match_status, current_streak, longest_streak, completed_goals, completed_tasks)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
    ['Bereket Haile', 'test2@yegna.com', hash('password123'), 'commit', 'Addis Ababa', 'amharic', 'matched', 5, 10, 1, 30]
  );
  const uid2 = r2.rows[0].id;

  const r3 = await pool.query(
    `INSERT INTO users (name, email, password_hash, mode, location, language, match_status)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
    ['Selam Girma', 'test3@yegna.com', hash('password123'), 'explore', 'Addis Ababa', 'english', 'pending']
  );
  const uid3 = r3.rows[0].id;

  await pool.query(
    `INSERT INTO users (name, email, password_hash, mode, location, language, match_status)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    ['Dawit Tilahun', 'test4@yegna.com', hash('password123'), 'surprise', 'Addis Ababa', 'english', 'pending']
  );

  await pool.query(
    `INSERT INTO users (name, email, password_hash, mode, location, language, match_status)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    ['Hiwot Alemu', 'test5@yegna.com', hash('password123'), 'explore', 'Addis Ababa', 'both', 'pending']
  );

  await pool.query('UPDATE users SET match_id = $1 WHERE id = $2', [uid2, uid1]);
  await pool.query('UPDATE users SET match_id = $1 WHERE id = $2', [uid1, uid2]);

  const g1 = await pool.query(
    'INSERT INTO goals (user_id, mode, category, description, duration_days, daily_commitment) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
    [uid1, 'commit', 'Fitness', 'Run 5km without stopping', 90, '30 min']
  );
  const gid1 = g1.rows[0].id;

  const g2 = await pool.query(
    'INSERT INTO goals (user_id, mode, category, description, duration_days, daily_commitment) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
    [uid2, 'commit', 'Fitness', 'Run 5km without stopping', 90, '30 min']
  );
  const gid2 = g2.rows[0].id;

  await pool.query(
    'INSERT INTO goals (user_id, mode, category, description, duration_days, daily_commitment) VALUES ($1,$2,$3,$4,$5,$6)',
    [uid1, 'commit', 'Reading', 'Read 12 books this year', 365, '1 hour']
  );

  await pool.query(
    'INSERT INTO goals (user_id, mode, category, description, location, date_from, date_to) VALUES ($1,$2,$3,$4,$5,$6,$7)',
    [uid1, 'explore', 'Hiking', 'Hike Entoto Mountain', 'Addis Ababa', '2026-06-15', '2026-06-16']
  );

  await pool.query(
    'INSERT INTO goals (user_id, mode, category, interests, openness_level) VALUES ($1,$2,$3,$4,$5)',
    [uid1, 'surprise', 'Surprise Me', JSON.stringify(['Reading', 'Nature']), 4]
  );

  await pool.query('INSERT INTO matches (user_1_id, user_2_id, mode, goal_id) VALUES ($1, $2, $3, $4)', [uid1, uid2, 'commit', gid1]);
  await pool.query('UPDATE matches SET goal_id = $1 WHERE user_1_id = $2 AND user_2_id = $3', [gid2, uid2, uid1]);

  const today = new Date();
  const moods = [3, 4, 5, 4, 4];
  for (let i = 4; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    await pool.query(
      'INSERT INTO checkins (user_id, mood, note, checkin_date) VALUES ($1,$2,$3,$4::DATE)',
      [uid1, moods[i], `Day ${5 - i} check-in`, ds]
    );
    await pool.query(
      'INSERT INTO checkins (user_id, mood, note, checkin_date) VALUES ($1,$2,$3,$4::DATE)',
      [uid2, moods[i], `Day ${5 - i} check-in`, ds]
    );
  }

  const badgeData = [
    [uid1, 'streak_7', '7-Day Streak', '🔥'],
    [uid1, 'checkins_30', '30 Check-ins', '📋'],
    [uid1, 'first_match', 'First Match', '🤝'],
    [uid1, 'goals_2', '2 Goals Completed', '🎯'],
    [uid2, 'streak_7', '7-Day Streak', '🔥'],
    [uid2, 'first_match', 'First Match', '🤝'],
  ];
  for (const [u, t, n, ic] of badgeData) {
    await pool.query('INSERT INTO badges (user_id, type, name, icon) VALUES ($1,$2,$3,$4)', [u, t, n, ic]);
  }

  console.log('DB initialized and seeded.');
}
