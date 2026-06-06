import { Router } from 'express';
import pool from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { mood, note } = req.body;

    if (!mood || mood < 1 || mood > 5) {
      return res.status(400).json({ success: false, error: 'Mood must be between 1 and 5' });
    }

    const today = new Date().toISOString().split('T')[0];

    const { rows: existing } = await pool.query(
      'SELECT id FROM checkins WHERE user_id = $1 AND checkin_date = $2::DATE',
      [userId, today]
    );
    if (existing.length > 0) {
      return res.status(409).json({ success: false, error: 'Already checked in today' });
    }

    await pool.query(
      'INSERT INTO checkins (user_id, mood, note, checkin_date) VALUES ($1, $2, $3, $4::DATE)',
      [userId, mood, note || '', today]
    );

    const { rows: dates } = await pool.query(
      'SELECT checkin_date FROM checkins WHERE user_id = $1 ORDER BY checkin_date DESC',
      [userId]
    );

    let streak = 0;
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    for (const row of dates) {
      const d = new Date(row.checkin_date);
      const expected = new Date(todayDate);
      expected.setDate(expected.getDate() - streak);

      if (d.getTime() === expected.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    await pool.query(
      'UPDATE users SET current_streak = $1, longest_streak = GREATEST(longest_streak, $2) WHERE id = $3',
      [streak, streak, userId]
    );

    const { rows: checkins } = await pool.query(
      'SELECT * FROM checkins WHERE user_id = $1 AND checkin_date = $2::DATE',
      [userId, today]
    );

    res.status(201).json({ success: true, data: { checkin: checkins[0], newStreak: streak } });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ success: false, error: 'Already checked in today' });
    }
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { rows: users } = await pool.query('SELECT match_id FROM users WHERE id = $1', [userId]);
    const ids = users[0]?.match_id ? [userId, users[0].match_id] : [userId];

    const { rows } = await pool.query(
      `SELECT c.*, u.name as user_name FROM checkins c JOIN users u ON u.id = c.user_id
       WHERE c.user_id = ANY($1::int[]) ORDER BY c.created_at DESC LIMIT 20`,
      [ids]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.get('/activity', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { rows: users } = await pool.query('SELECT match_id FROM users WHERE id = $1', [userId]);
    const ids = users[0]?.match_id ? [userId, users[0].match_id] : [userId];

    const { rows } = await pool.query(
      `SELECT c.id, c.user_id, u.name as user_name, c.mood, c.note, c.checkin_date, c.created_at
       FROM checkins c JOIN users u ON u.id = c.user_id
       WHERE c.user_id = ANY($1::int[]) ORDER BY c.created_at DESC LIMIT 10`,
      [ids]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
