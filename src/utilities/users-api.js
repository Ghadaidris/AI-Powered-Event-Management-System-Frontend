// utilities/users-api.js
import sendRequest from './sendRequest';

const BASE_URL = 'http://127.0.0.1:8000';

// Helper to get token headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// === PROFILES ===
export const getUser = () => sendRequest('/profiles/me/', 'GET', null, getAuthHeaders());
export const getProfiles = () => sendRequest('/profiles/', 'GET', null, getAuthHeaders());
export const updateProfile = (id, data) => sendRequest(`/profiles/${id}/`, 'PATCH', data, getAuthHeaders());

// === COMPANIES ===
export const getCompanies = () => sendRequest('/companies/', 'GET', null, getAuthHeaders());
export const createCompany = (data) => sendRequest('/companies/', 'POST', { name: data.name }, getAuthHeaders());
export const updateCompany = (id, data) => sendRequest(`/companies/${id}/`, 'PATCH', data, getAuthHeaders());
export const deleteCompany = (id) => sendRequest(`/companies/${id}/`, 'DELETE', null, getAuthHeaders());

// === EVENTS ===
export const getEvents = () => sendRequest('/events/', 'GET', null, getAuthHeaders());
export const createEvent = (data) => sendRequest('/events/', 'POST', {
  title: data.title,
  date: data.date,
  location: data.location,
  company: data.company || null
}, getAuthHeaders());
export const updateEvent = (id, data) => sendRequest(`/events/${id}/`, 'PATCH', data, getAuthHeaders());
export const deleteEvent = (id) => sendRequest(`/events/${id}/`, 'DELETE', null, getAuthHeaders());

// === TEAMS ===
export const getTeams = () => sendRequest('/teams/', 'GET', null, getAuthHeaders());
export const createTeam = (data) => sendRequest('/teams/', 'POST', {
  name: data.name,
  event: data.event,
  manager: data.manager,
  members: data.members || []
}, getAuthHeaders());
export const updateTeam = (id, data) => sendRequest(`/teams/${id}/`, 'PATCH', data, getAuthHeaders());
export const deleteTeam = (id) => sendRequest(`/teams/${id}/`, 'DELETE', null, getAuthHeaders());
export const addTeamMember = (teamId, memberId) => 
  sendRequest(`/teams/${teamId}/add-member/`, 'POST', { member_id: memberId }, getAuthHeaders());

// === MISSIONS ===
export const getMissions = () => sendRequest('/missions/', 'GET', null, getAuthHeaders());
export const createMission = (data) => sendRequest('/missions/', 'POST', {
  title: data.title,
  description: data.description || '',
  event: data.event,
  team: data.team || null
}, getAuthHeaders());
export const updateMission = (id, data) => sendRequest(`/missions/${id}/`, 'PATCH', data, getAuthHeaders());
export const deleteMission = (id) => sendRequest(`/missions/${id}/`, 'DELETE', null, getAuthHeaders());

// === TASKS ===
export const getTasks = () => sendRequest('/tasks/', 'GET', null, getAuthHeaders());
export const getStaffTasks = () => sendRequest('/tasks/my-tasks/', 'GET', null, getAuthHeaders());
export const createTask = (data) => sendRequest('/tasks/', 'POST', {
  title: data.title,
  description: data.description || '',
  assignee: data.assignee,
  mission: data.mission,
  team: data.team || null
}, getAuthHeaders());
export const updateTask = (id, data) => sendRequest(`/tasks/${id}/`, 'PATCH', data, getAuthHeaders());
export const deleteTask = (id) => sendRequest(`/tasks/${id}/`, 'DELETE', null, getAuthHeaders());
export const updateTaskStatus = (taskId, status) => 
  sendRequest(`/tasks/${taskId}/update-status/`, 'PATCH', { status }, getAuthHeaders());
export const requestTaskDeletion = (taskId) => 
  sendRequest(`/tasks/${taskId}/request-delete/`, 'POST', null, getAuthHeaders());

// === GEMINI AI ENDPOINTS ===
export const aiSuggestMission = (eventId) => 
  sendRequest('/ai/suggest-mission/', 'POST', { event: parseInt(eventId) }, getAuthHeaders());
export const aiSplitMission = (missionId) => sendRequest(`/missions/${missionId}/ai-split/`, 'POST', null, getAuthHeaders());
export const approveMission = (missionId, updates = []) => sendRequest(`/missions/${missionId}/approve/`, 'PATCH', { updates }, getAuthHeaders());

// === AUTH ===
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

export function logout() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
}
