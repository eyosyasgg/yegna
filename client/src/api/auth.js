import client from './client';

export const loginUser = (email, password) =>
  client.post('/auth/login', { email, password }).then(r => r.data);

export const registerUser = (data) =>
  client.post('/auth/register', data).then(r => r.data);

export const getMe = () =>
  client.get('/auth/me').then(r => r.data);
