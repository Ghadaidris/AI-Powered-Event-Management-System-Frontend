// utilities/users-api.js
import sendRequest from './sendRequest';

const BASE_URL = 'http://127.0.0.1:8000';

// === PROFILES ===
export const getUser = () => sendRequest('/profiles/me/');
export const getProfiles = () => sendRequest('/profiles/');
export const updateProfile = (id, data) => sendRequest(`/profiles/${id}/`, 'PATCH', data);

// === COMPANIES ===
export const getCompanies = () => sendRequest('/companies/');
export const createCompany = (data) => sendRequest('/companies/', 'POST', { name: data.name });
export const updateCompany = (id, data) => sendRequest(`/companies/${id}/`, 'PATCH', data);
export const deleteCompany = (id) => sendRequest(`/companies/${id}/`, 'DELETE');

// === EVENTS ===
export const getEvents = () => sendRequest('/events/');
export const createEvent = (data) => sendRequest('/events/', 'POST', {
  title: data.title,
  date: data.date,
  location: data.location,
  company: data.company || null
});
export const updateEvent = (id, data) => sendRequest(`/events/${id}/`, 'PATCH', data);
export const deleteEvent = (id) => sendRequest(`/events/${id}/`, 'DELETE');
export const getAISuggestions = (eventId) => sendRequest(`/events/${eventId}/ai-suggest/`, 'GET');

// === TEAMS ===
export const getTeams = () => sendRequest('/teams/');
export const createTeam = (data) => sendRequest('/teams/', 'POST', {
  name: data.name,
  event: data.event,
  manager: data.manager,
  members: data.members || []
});
export const updateTeam = (id, data) => sendRequest(`/teams/${id}/`, 'PATCH', data);
export const deleteTeam = (id) => sendRequest(`/teams/${id}/`, 'DELETE');
export const addTeamMember = (teamId, memberId) => 
  sendRequest(`/teams/${teamId}/add-member/`, 'POST', { member_id: memberId });

// === MISSIONS (Organizer / Manager) ===
export const getMissions = () => sendRequest('/missions/');
export const createMission = (data) => sendRequest('/missions/', 'POST', {
  title: data.title,
  description: data.description || '',
  event: data.event,
  team: data.team || null
});
export const updateMission = (id, data) => sendRequest(`/missions/${id}/`, 'PATCH', data);
export const deleteMission = (id) => sendRequest(`/missions/${id}/`, 'DELETE');

// === AI WORKFLOW ===
export const aiSplitMission = (missionId) => sendRequest(`/missions/${missionId}/ai_assign/`, 'POST');
export const approveMission = (missionId) => sendRequest(`/missions/${missionId}/approve/`, 'PATCH');

// === TASKS (Manager / Staff) ===
export const getTasks = () => sendRequest('/tasks/');
export const getStaffTasks = () => sendRequest('/tasks/my-tasks/');
export const createTask = (data) => sendRequest('/tasks/', 'POST', {
  title: data.title,
  description: data.description || '',
  assignee: data.assignee,
  mission: data.mission,
  team: data.team || null
});
export const updateTask = (id, data) => sendRequest(`/tasks/${id}/`, 'PATCH', data);
export const deleteTask = (id) => sendRequest(`/tasks/${id}/`, 'DELETE');

// === TASK STATUS & DELETION (Staff) ===
export const updateTaskStatus = (taskId, status) => 
  sendRequest(`/tasks/${taskId}/update-status/`, 'PATCH', { status });

export const requestTaskDeletion = (taskId) => 
  sendRequest(`/tasks/${taskId}/request-delete/`, 'POST');
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
