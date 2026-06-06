import { Router } from 'express';
import pool from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { rows: users } = await pool.query('SELECT match_id, mode FROM users WHERE id = $1', [userId]);
    if (!users[0]) return res.status(404).json({ success: false, error: 'User not found' });

    const user = users[0];
    if (!user.match_id) {
      return res.json({ success: true, data: { matched: false } });
    }

    const { rows: partners } = await pool.query(
      'SELECT id, name, bio, location, language, mode, current_streak, longest_streak FROM users WHERE id = $1',
      [user.match_id]
    );
    if (!partners[0]) return res.json({ success: true, data: { matched: false } });

    const { rows: matches } = await pool.query(
      `SELECT * FROM matches WHERE (user_1_id = $1 AND user_2_id = $2) OR (user_1_id = $2 AND user_2_id = $1) ORDER BY started_at DESC LIMIT 1`,
      [userId, user.match_id]
    );

    const match = matches[0];
    const daysActive = match ? Math.floor((Date.now() - new Date(match.started_at).getTime()) / (1000 * 60 * 60 * 24)) + 1 : 0;

    const { rows: uStreak } = await pool.query('SELECT current_streak FROM users WHERE id = $1', [userId]);
    const { rows: pStreak } = await pool.query('SELECT current_streak FROM users WHERE id = $1', [user.match_id]);

    res.json({
      success: true,
      data: {
        matched: true,
        partner: partners[0],
        match,
        daysActive,
        userStreak: uStreak[0].current_streak,
        partnerStreak: pStreak[0].current_streak,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
