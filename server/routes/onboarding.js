import { Router } from 'express';
import pool from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const { mode, goalData, profileData } = req.body;
    const userId = req.user.userId;

    if (!mode || !goalData) {
      return res.status(400).json({ success: false, error: 'Mode and goal data are required' });
    }

    await pool.query(
      `UPDATE users SET mode = $1, bio = $2, location = $3, language = $4 WHERE id = $5`,
      [mode, profileData?.bio || '', profileData?.location || '', profileData?.language || 'both', userId]
    );

    const { category, description, duration_days, daily_commitment, location, date_from, date_to, interests, openness_level } = goalData;

    const { rows: goals } = await pool.query(
      `INSERT INTO goals (user_id, mode, category, description, duration_days, daily_commitment, location, date_from, date_to, interests, openness_level)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [userId, mode, category || '', description || '', duration_days || 0, daily_commitment || '', location || '', date_from || '', date_to || '', JSON.stringify(interests || []), openness_level || 3]
    );
    const goal = goals[0];

    const { rows: candidates } = await pool.query(
      `SELECT g.id as goal_id, u.id as user_id, u.name, u.location FROM goals g
       JOIN users u ON u.id = g.user_id
       WHERE g.mode = $1 AND g.status = 'active' AND g.user_id != $2
       AND NOT EXISTS (SELECT 1 FROM matches m WHERE (m.user_1_id = g.user_id OR m.user_2_id = g.user_id) AND m.goal_id = g.id AND m.status = 'active')
       LIMIT 1`,
      [mode, userId]
    );

    let matched = false;
    let partner = null;

    if (candidates.length > 0) {
      const c = candidates[0];
      await pool.query('INSERT INTO matches (user_1_id, user_2_id, mode, goal_id) VALUES ($1,$2,$3,$4)', [userId, c.user_id, mode, goal.id]);
      await pool.query('UPDATE matches SET goal_id = $1 WHERE user_1_id = $2 AND user_2_id = $3', [c.goal_id, c.user_id, userId]);

      await pool.query("UPDATE users SET match_status = 'matched' WHERE id IN ($1,$2)", [userId, c.user_id]);

      partner = { id: c.user_id, name: c.name, location: c.location };
      matched = true;
    }

    res.status(201).json({
      success: true,
      data: { matched, partner, goal: { ...goal, interests: goal.interests ? (typeof goal.interests === 'string' ? JSON.parse(goal.interests) : goal.interests) : [] } },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
