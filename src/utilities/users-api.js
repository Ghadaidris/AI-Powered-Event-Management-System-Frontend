import sendRequest from './sendRequest';

const BASE_URL = 'http://127.0.0.1:8000'; 

// === Events ===
export const getEvents = () => sendRequest('/events/');
export const createEvent = (data) => sendRequest('/events/', 'POST', data);
export const updateEvent = (id, data) => sendRequest(`/events/${id}/`, 'PATCH', data);
export const deleteEvent = (id) => sendRequest(`/events/${id}/`, 'DELETE');

// === Companies ===
export const getCompanies = () => sendRequest('/companies/');
export const createCompany = (data) => sendRequest('/companies/', 'POST', data);
export const updateCompany = (id, data) => sendRequest(`/companies/${id}/`, 'PATCH', data);
export const deleteCompany = (id) => sendRequest(`/companies/${id}/`, 'DELETE');

// === Tasks ===
export const getTasks = () => sendRequest('/tasks/');
export const createTask = (data) => sendRequest('/tasks/', 'POST', data);
export const updateTask = (id, data) => sendRequest(`/tasks/${id}/`, 'PATCH', data);
export const deleteTask = (id) => sendRequest(`/tasks/${id}/`, 'DELETE');

// === Teams ===
export const getTeams = () => sendRequest('/teams/');
export const createTeam = (data) => sendRequest('/teams/', 'POST', data);
export const updateTeam = (id, data) => sendRequest(`/teams/${id}/`, 'PATCH', data);
export const deleteTeam = (id) => sendRequest(`/teams/${id}/`, 'DELETE');

// === AI Suggestions ===
export const getAISuggestions = (eventId) =>
  sendRequest(`/events/${eventId}/ai-suggest/`, 'GET');

// === Profile ===
export const getUser = () => sendRequest('/profiles/me/');
export const updateProfile = (id, data) => sendRequest(`/profiles/${id}/`, 'PATCH', data);
export const getProfiles = () => sendRequest('/profiles/');

// === Auth ===
export const login = (credentials) =>
  fetch(`${BASE_URL}/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  }).then(res => res.ok ? res.json() : Promise.reject('Login failed'));

export const signup = (credentials) =>
  fetch(`${BASE_URL}/signup/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  }).then(res => res.ok ? res.json() : Promise.reject('Signup failed'));
