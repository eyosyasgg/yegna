import client from './client';

export const submitCheckin = (data) =>
  client.post('/checkins', data).then(r => r.data);

export const getCheckins = () =>
  client.get('/checkins').then(r => r.data);

export const getActivity = () =>
  client.get('/checkins/activity').then(r => r.data);
