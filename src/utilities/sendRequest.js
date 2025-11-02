// frontend/src/utilities/sendRequest.js
const BASE_URL = 'http://127.0.0.1:8000';

export default async function sendRequest(path) {
  const token = localStorage.getItem('accessToken');
  console.log('Token being sent:', token);

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    }
  });

  if (!res.ok) {
    console.error('Request failed:', res.status);
    throw new Error('Unauthorized');
  }

  return res.json();
}