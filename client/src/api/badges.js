import client from './client';

export const getBadges = () =>
  client.get('/badges').then(r => r.data);
