import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import authRoutes from '../routes/auth.js';
import profileRoutes from '../routes/profile.js';
import goalsRoutes from '../routes/goals.js';
import matchRoutes from '../routes/match.js';
import checkinsRoutes from '../routes/checkins.js';
import badgesRoutes from '../routes/badges.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/checkins', checkinsRoutes);
app.use('/api/badges', badgesRoutes);

let token;
let goalId;

describe('Auth Endpoints', () => {
  it('POST /api/auth/register - creates a new user', async () => {
    const email = `test-${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email, password: 'test123' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data).toHaveProperty('user');
    expect(res.body.data.user.name).toBe('Test User');
  });

  it('POST /api/auth/register - rejects duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test1@yegna.com', password: 'test123' });
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login - authenticates valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test1@yegna.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    token = res.body.data.token;
  });

  it('POST /api/auth/login - rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test1@yegna.com', password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/auth/me - returns authenticated user', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('test1@yegna.com');
  });

  it('GET /api/auth/me - rejects without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

describe('Goals Endpoints', () => {
  it('GET /api/goals - returns goals for authenticated user', async () => {
    const res = await request(app)
      .get('/api/goals')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    const commitGoals = res.body.data.filter(g => g.mode === 'commit');
    expect(commitGoals.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/goals?mode=commit - filters by mode', async () => {
    const res = await request(app)
      .get('/api/goals?mode=commit')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    res.body.data.forEach(g => expect(g.mode).toBe('commit'));
  });

  it('GET /api/goals?mode=explore - filters by mode', async () => {
    const res = await request(app)
      .get('/api/goals?mode=explore')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    res.body.data.forEach(g => expect(g.mode).toBe('explore'));
  });

  it('POST /api/goals - creates a new commit goal', async () => {
    const res = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${token}`)
      .send({ mode: 'commit', category: 'Reading', description: 'Test reading goal', duration_days: 30, daily_commitment: '30 min' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.goal.mode).toBe('commit');
    expect(res.body.data.goal.category).toBe('Reading');
    goalId = res.body.data.goal.id;
  });

  it('POST /api/goals - creates a new explore goal', async () => {
    const res = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${token}`)
      .send({ mode: 'explore', category: 'Hiking', location: 'Test City', date_from: '2026-07-01', date_to: '2026-07-02' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.goal.mode).toBe('explore');
  });

  it('POST /api/goals - rejects invalid mode', async () => {
    const res = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${token}`)
      .send({ mode: 'invalid', category: 'Test' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/goals/suggestions - returns suggestions', async () => {
    const res = await request(app)
      .get('/api/goals/suggestions?mode=commit')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/goals/surprise - returns random goals', async () => {
    const res = await request(app)
      .get('/api/goals/surprise')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(3);
  });

  it('PUT /api/goals/:id/complete - marks goal complete', async () => {
    if (!goalId) return;
    const res = await request(app)
      .put(`/api/goals/${goalId}/complete`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('completed');
  });

  it('PUT /api/goals/99999/complete - returns 404 for missing goal', async () => {
    const res = await request(app)
      .put('/api/goals/99999/complete')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});

describe('Match Endpoints', () => {
  it('GET /api/match - returns matches', async () => {
    const res = await request(app)
      .get('/api/match')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    if (res.body.data.length > 0) {
      expect(res.body.data[0]).toHaveProperty('partner');
      expect(res.body.data[0]).toHaveProperty('goal');
    }
  });
});

describe('Check-in Endpoints', () => {
  it('POST /api/checkins - creates a check-in', async () => {
    const res = await request(app)
      .post('/api/checkins')
      .set('Authorization', `Bearer ${token}`)
      .send({ mood: 4 });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/checkins - rejects duplicate check-in', async () => {
    const res = await request(app)
      .post('/api/checkins')
      .set('Authorization', `Bearer ${token}`)
      .send({ mood: 3 });
    expect(res.status).toBe(409);
  });

  it('POST /api/checkins - rejects invalid mood', async () => {
    const otherToken = (await request(app).post('/api/auth/login').send({ email: 'test3@yegna.com', password: 'password123' })).body.data.token;
    const res = await request(app)
      .post('/api/checkins')
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ mood: 6 });
    expect(res.status).toBe(400);
  });

  it('GET /api/checkins - returns check-in history', async () => {
    const res = await request(app)
      .get('/api/checkins')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/checkins/activity - returns activity feed', async () => {
    const res = await request(app)
      .get('/api/checkins/activity')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('Profile Endpoint', () => {
  it('GET /api/profile - returns full profile', async () => {
    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('user');
    expect(res.body.data).toHaveProperty('goals');
    expect(res.body.data).toHaveProperty('matches');
    expect(res.body.data).toHaveProperty('totalCheckins');
    expect(Array.isArray(res.body.data.goals)).toBe(true);
    expect(Array.isArray(res.body.data.matches)).toBe(true);
  });
});

describe('Badges Endpoint', () => {
  it('GET /api/badges - returns earned badges', async () => {
    const res = await request(app)
      .get('/api/badges')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    if (res.body.data.length > 0) {
      expect(res.body.data[0]).toHaveProperty('name');
      expect(res.body.data[0]).toHaveProperty('icon');
    }
  });
});
