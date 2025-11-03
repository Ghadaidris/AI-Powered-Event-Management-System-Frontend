// frontend/src/utilities/sendRequest.js
const BASE_URL = 'http://127.0.0.1:8000';

export default async function sendRequest(path, method = 'GET', body = null) {
  const token = localStorage.getItem('accessToken');
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, options);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Request failed');
    }
    return await res.json();
  } catch (err) {
    console.error('Request failed:', err.message);
    throw err;
  }
}