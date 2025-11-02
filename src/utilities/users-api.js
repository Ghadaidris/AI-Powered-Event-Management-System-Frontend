// frontend/src/utilities/users-api.js
import sendRequest from './sendRequest';

const BASE_URL = 'http://127.0.0.1:8000';

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
  }).then(res => {
    if (!res.ok) return res.json().then(err => Promise.reject(err));
    return res.json();
  });

  
export const getUser = () => sendRequest('/profiles/me/');
export const getProfiles = () => sendRequest('/profiles/');
export const getCompanies = () => sendRequest('/companies/');
export const getEvents = () => sendRequest('/events/');