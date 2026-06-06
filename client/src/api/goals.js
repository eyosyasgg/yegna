import client from './client';

export const getGoals = (mode) =>
  client.get(`/goals${mode ? `?mode=${mode}` : ''}`).then(r => r.data);

export const createGoal = (data) =>
  client.post('/goals', data).then(r => r.data);

export const getSuggestions = (mode) =>
  client.get(`/goals/suggestions?mode=${mode}`).then(r => r.data);

export const getSurprise = () =>
  client.get('/goals/surprise').then(r => r.data);

export const completeGoal = (id) =>
  client.put(`/goals/${id}/complete`).then(r => r.data);
