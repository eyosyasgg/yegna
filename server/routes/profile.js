import { Router } from 'express';
import pool from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    const { rows: users } = await pool.query(
      'SELECT id, name, email, bio, location, language, mode, match_status, match_id, current_streak, longest_streak, created_at FROM users WHERE id = $1',
      [userId]
    );
    if (!users[0]) return res.status(404).json({ success: false, error: 'User not found' });

    const { rows: goals } = await pool.query(
      'SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    let partner = null;
    if (users[0].match_id) {
      const { rows: partners } = await pool.query(
        'SELECT id, name, bio, location, language, mode, current_streak, longest_streak FROM users WHERE id = $1',
        [users[0].match_id]
      );
      partner = partners[0] || null;
    }

    const { rows: count } = await pool.query('SELECT COUNT(*)::int as cnt FROM checkins WHERE user_id = $1', [userId]);

    res.json({
      success: true,
      data: { user: users[0], goal: goals[0] || null, partner, totalCheckins: count[0].cnt },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.put('/', authenticate, async (req, res) => {
  try {
    const { bio, location, language } = req.body;
    const userId = req.user.userId;

    await pool.query(
      'UPDATE users SET bio = $1, location = $2, language = $3 WHERE id = $4',
      [bio || '', location || '', language || 'both', userId]
    );

    const { rows } = await pool.query(
      'SELECT id, name, email, bio, location, language, mode, match_status FROM users WHERE id = $1',
      [userId]
    );

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
