import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
config();

import { initDB } from './db/init.js';
import authRoutes from './routes/auth.js';
import onboardingRoutes from './routes/onboarding.js';
import profileRoutes from './routes/profile.js';
import matchRoutes from './routes/match.js';
import checkinRoutes from './routes/checkins.js';
import goalRoutes from './routes/goals.js';
import badgeRoutes from './routes/badges.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/checkins', checkinRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/badges', badgeRoutes);

if (process.env.VERCEL !== '1') {
  initDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Yegna server running on port ${PORT}`);
    });
  });
}

export default app;
