// frontend/src/pages/homePage/HomePage.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUser } from '../../utilities/users-api';
import './HomePage.css';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      getUser().then(data => {
        setUser({ username: data.username, role: data.role });
      }).catch(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="home-container">
      {/* Dynamic Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">EventAI</Link>
        <div className="nav-links">
          <Link to="/about">About</Link>
          {user ? (
            <>
              <span className="welcome">Hi, {user.username}!</span>
              {user.role === 'admin' && <Link to="/dashboard/admin" className="dash-link">Admin</Link>}
              {user.role === 'organizer' && <Link to="/dashboard/organizer" className="dash-link">Organizer</Link>}
              {user.role === 'manager' && <Link to="/dashboard/manager" className="dash-link">Manager</Link>}
              {user.role === 'staff' && <Link to="/dashboard/staff" className="dash-link">Staff</Link>}
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-nav">Login</Link>
              <Link to="/signup" className="btn-nav">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section (محافظ عليه + تحسين) */}
      <div className="hero">
        <h1>AI-Powered Event Management System</h1>
        <p>Organize smarter. Save time. Amaze your audience.</p>
        <div className="cta-buttons">
          {!user && (
            <>
              <Link to="/login" className="btn-primary">Login</Link>
              <Link to="/signup" className="btn-primary">Sign Up</Link>
            </>
          )}
          <Link to="/about" className="btn-secondary">About</Link>
        </div>
      </div>

      {/* Features (محافظ عليه) */}
      <div className="features">
        <div className="feature-card">
  <div className="icon">Target</div>
  <h3>Smart Task Management</h3>
  <p>Organize companies, events, and staff — all in one intelligent platform</p>
</div>
<div className="feature-card">
  <div className="icon">Lock</div>
  <h3>Role-Based Security</h3>
  <p>Admin, Organizer, Manager, Staff — each sees only what they need</p>
</div>
<div className="feature-card">
  <div className="icon">Rocket</div>
  <h3>AI-Powered Automation</h3>
  <p>Let AI suggest task distribution, teams, and optimal workflows</p>
</div>
      </div>
    </div>
  );
}