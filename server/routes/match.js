import { Router } from 'express';
import pool from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    const { rows } = await pool.query(
      `SELECT m.*, u.id as partner_id, u.name as partner_name, u.bio as partner_bio,
              u.location as partner_location, u.language as partner_language,
              u.current_streak as partner_streak, u.longest_streak as partner_longest_streak,
              g.mode as goal_mode, g.category as goal_category, g.description as goal_description,
              g.duration_days as goal_duration
       FROM matches m
       JOIN users u ON (CASE WHEN m.user_1_id = $1 THEN m.user_2_id ELSE m.user_1_id END) = u.id
       LEFT JOIN goals g ON g.id = m.goal_id
       WHERE (m.user_1_id = $1 OR m.user_2_id = $1) AND m.status = 'active'
       ORDER BY m.started_at DESC`,
      [userId]
    );

    const result = rows.map((r) => ({
      id: r.id,
      mode: r.goal_mode || r.mode,
      daysActive: Math.floor((Date.now() - new Date(r.started_at).getTime()) / (1000 * 60 * 60 * 24)) + 1,
      started_at: r.started_at,
      partner: {
        id: r.partner_id, name: r.partner_name, bio: r.partner_bio,
        location: r.partner_location, language: r.partner_language,
        streak: r.partner_streak, longestStreak: r.partner_longest_streak,
      },
      goal: r.goal_description ? {
        category: r.goal_category, description: r.goal_description, duration: r.goal_duration,
      } : null,
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
