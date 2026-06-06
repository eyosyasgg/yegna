import { Router } from 'express';
import pool from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const mode = req.query.mode;

    let query = `SELECT * FROM goals WHERE user_id = $1`;
    const params = [userId];
    if (mode) {
      query += ` AND mode = $2`;
      params.push(mode);
    }
    query += ` ORDER BY created_at DESC`;

    const { rows: goals } = await pool.query(query, params);

    const result = [];
    for (const g of goals) {
      const { rows: matches } = await pool.query(
        `SELECT m.*, u.id as partner_id, u.name as partner_name, u.bio as partner_bio, u.location as partner_location,
                u.current_streak as partner_streak, u.longest_streak as partner_longest_streak
         FROM matches m JOIN users u ON (CASE WHEN m.user_1_id = $1 THEN m.user_2_id ELSE m.user_1_id END) = u.id
         WHERE (m.user_1_id = $1 OR m.user_2_id = $1) AND m.goal_id = $2 AND m.status = 'active'
         ORDER BY m.started_at DESC LIMIT 1`,
        [userId, g.id]
      );

      const match = matches[0];
      const daysActive = match ? Math.floor((Date.now() - new Date(match.started_at).getTime()) / (1000 * 60 * 60 * 24)) + 1 : 0;

      result.push({
        ...g,
        interests: g.interests ? JSON.parse(g.interests) : [],
        matched: !!match,
        daysActive,
        partner: match ? {
          id: match.partner_id, name: match.partner_name, bio: match.partner_bio,
          location: match.partner_location, streak: match.partner_streak,
        } : null,
      });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { mode, category, description, duration_days, daily_commitment, location, date_from, date_to, interests, openness_level } = req.body;

    if (!mode) return res.status(400).json({ success: false, error: 'Mode is required' });

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
      await pool.query('UPDATE matches SET goal_id = $1 WHERE user_1_id = $2 AND user_2_id = $3 AND mode = $4', [c.goal_id, c.user_id, userId, mode]);

      partner = { id: c.user_id, name: c.name, location: c.location };
      matched = true;
    }

    res.status(201).json({
      success: true,
      data: { goal: { ...goal, interests: goal.interests ? JSON.parse(goal.interests) : [] }, matched, partner },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.get('/suggestions', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const mode = req.query.mode;

    if (!mode) return res.status(400).json({ success: false, error: 'Mode is required' });

    const { rows } = await pool.query(
      `SELECT g.*, u.id as user_id, u.name as user_name, u.location as user_location
       FROM goals g JOIN users u ON u.id = g.user_id
       WHERE g.mode = $1 AND g.status = 'active' AND g.user_id != $2
       AND NOT EXISTS (SELECT 1 FROM matches m WHERE (m.user_1_id = g.user_id OR m.user_2_id = g.user_id) AND m.goal_id = g.id AND m.status = 'active')
       ORDER BY RANDOM() LIMIT 10`,
      [mode, userId]
    );

    res.json({ success: true, data: rows.map(r => ({ ...r, interests: r.interests ? JSON.parse(r.interests) : [] })) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.get('/surprise', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    const { rows } = await pool.query(
      `SELECT g.*, u.id as user_id, u.name as user_name, u.location as user_location
       FROM goals g JOIN users u ON u.id = g.user_id
       WHERE g.status = 'active' AND g.user_id != $1
       AND NOT EXISTS (SELECT 1 FROM matches m WHERE (m.user_1_id = g.user_id OR m.user_2_id = g.user_id) AND m.goal_id = g.id AND m.status = 'active')
       ORDER BY RANDOM() LIMIT 3`,
      [userId]
    );

    res.json({ success: true, data: rows.map(r => ({ ...r, interests: r.interests ? JSON.parse(r.interests) : [] })) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.put('/:id/complete', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const goalId = req.params.id;

    const { rows: goals } = await pool.query('SELECT * FROM goals WHERE id = $1 AND user_id = $2', [goalId, userId]);
    if (!goals[0]) return res.status(404).json({ success: false, error: 'Goal not found' });

    await pool.query("UPDATE goals SET status = 'completed' WHERE id = $1", [goalId]);
    await pool.query('UPDATE users SET completed_goals = completed_goals + 1 WHERE id = $1', [userId]);

    await pool.query(
      "INSERT INTO badges (user_id, type, name, icon) SELECT $1, 'goal_completed', $2 || ' Completed', '🎯' WHERE NOT EXISTS (SELECT 1 FROM badges WHERE user_id = $1 AND type = 'goal_completed')",
      [userId, goals[0].category]
    );

    res.json({ success: true, data: { completed: true } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
