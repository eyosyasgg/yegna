import client from './client';

export const getProfile = () =>
  client.get('/profile').then(r => r.data);

export const updateProfile = (data) =>
  client.put('/profile', data).then(r => r.data);
