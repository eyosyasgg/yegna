import { Router } from 'express';
import pool from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    const { rows: users } = await pool.query(
      `SELECT id, name, email, bio, location, language, mode, match_status, current_streak, longest_streak, completed_goals, completed_tasks, created_at FROM users WHERE id = $1`,
      [userId]
    );
    if (!users[0]) return res.status(404).json({ success: false, error: 'User not found' });

    const { rows: goals } = await pool.query(
      'SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    const { rows: matches } = await pool.query(
      `SELECT m.*, u.id as partner_id, u.name as partner_name, u.bio as partner_bio, u.location as partner_location,
              u.current_streak as partner_streak
       FROM matches m JOIN users u ON (CASE WHEN m.user_1_id = $1 THEN m.user_2_id ELSE m.user_1_id END) = u.id
       WHERE (m.user_1_id = $1 OR m.user_2_id = $1) AND m.status = 'active'
       ORDER BY m.started_at DESC`,
      [userId]
    );

    const { rows: count } = await pool.query('SELECT COUNT(*)::int as cnt FROM checkins WHERE user_id = $1', [userId]);

    const { rows: badges } = await pool.query(
      'SELECT * FROM badges WHERE user_id = $1 ORDER BY earned_at DESC',
      [userId]
    );

    res.json({
      success: true,
      data: {
        user: users[0],
        goals: goals.map(g => ({ ...g, interests: g.interests ? (typeof g.interests === 'string' ? JSON.parse(g.interests) : g.interests) : [] })),
        matches,
        totalCheckins: count[0].cnt,
        badges,
      },
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
