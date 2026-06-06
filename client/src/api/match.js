import client from './client';

export const getMatch = () =>
  client.get('/match').then(r => r.data);
