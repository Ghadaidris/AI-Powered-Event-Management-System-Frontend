// frontend/src/utilities/sendRequest.js
const BASE_URL = 'http://127.0.0.1:8000';

async function refreshAccessToken() {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) throw new Error('No refresh token');

  const res = await fetch(`${BASE_URL}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh })
  });

  if (!res.ok) throw new Error('Token refresh failed');
  const data = await res.json();
  localStorage.setItem('access', data.access);
  return data.access;
}

export default async function sendRequest(path, method = 'GET', body = null) {
  let token = localStorage.getItem('access');

  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    let res = await fetch(`${BASE_URL}${path}`, options);

    // إذا 401 → جربي refresh
    if (res.status === 401 && path !== '/token/refresh/') {
      try {
        token = await refreshAccessToken();
        options.headers['Authorization'] = `Bearer ${token}`;
        res = await fetch(`${BASE_URL}${path}`, options);
      } catch (err) {
        localStorage.clear();
        window.location.href = '/login';
        return;
      }
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || 'Request failed');
    }

    if (res.status === 204) return null;
    return await res.json();
  } catch (err) {
    console.error('Request failed:', err.message);
    throw err;
  }
}