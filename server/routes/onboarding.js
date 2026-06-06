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
      `UPDATE users SET mode = $1, bio = $2, location = $3, language = $4, match_status = 'pending' WHERE id = $5`,
      [mode, profileData?.bio || '', profileData?.location || '', profileData?.language || 'both', userId]
    );

    const { category, description, duration_days, daily_commitment, location, date_from, date_to, interests, openness_level } = goalData;

    await pool.query(
      `INSERT INTO goals (user_id, mode, category, description, duration_days, daily_commitment, location, date_from, date_to, interests, openness_level)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [userId, mode, category || '', description || '', duration_days || 0, daily_commitment || '', location || '', date_from || '', date_to || '', JSON.stringify(interests || []), openness_level || 3]
    );

    const { rows: candidates } = await pool.query(
      `SELECT id, name, location FROM users WHERE mode = $1 AND match_status = 'pending' AND id != $2 LIMIT 1`,
      [mode, userId]
    );

    if (candidates.length > 0) {
      const candidate = candidates[0];

      await pool.query('INSERT INTO matches (user_1_id, user_2_id, mode) VALUES ($1, $2, $3)', [userId, candidate.id, mode]);
      await pool.query("UPDATE users SET match_status = 'matched', match_id = $1 WHERE id = $2", [candidate.id, userId]);
      await pool.query("UPDATE users SET match_status = 'matched', match_id = $1 WHERE id = $2", [userId, candidate.id]);

      res.status(201).json({
        success: true,
        data: { matched: true, partner: { id: candidate.id, name: candidate.name, location: candidate.location } },
      });
    } else {
      res.status(201).json({ success: true, data: { matched: false, partner: null } });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
