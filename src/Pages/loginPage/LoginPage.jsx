// frontend/src/pages/loginPage/LoginPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../utilities/users-api';
import './LoginPage.css';

const token = localStorage.getItem('access');

export default function LoginPage({ setUser }) {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log({token})
    if (token) navigate("/")
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(creds);
      
      // ← عدّلي هنا: استخدمي 'refresh' مو 'refreshToken'
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);  // ← هذا الصحيح
      localStorage.setItem('accessRole', data.role);

      setUser({ role: data.role });

      // تحويل بناءً على الـ role
      if (data.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (data.role === 'organizer') {
        navigate('/dashboard/organizer');
      } else if (data.role === 'manager') {
        navigate('/dashboard/manager');
      } else if (data.role === 'staff') {
        navigate('/dashboard/staff');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Username"
            value={creds.username}
            onChange={e => setCreds({ ...creds, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={creds.password}
            onChange={e => setCreds({ ...creds, password: e.target.value })}
          />
          <button type="submit">Login</button>
        </form>
        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign Up as Staff</a>
        </p>
      </div>
    </div>
  );
}