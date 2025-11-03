import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUser } from '../utilities/users-api';
import './Navbar.css';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getUser().then(setUser).catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  if (!user) return null;

  return (
    <nav className="dashboard-navbar">
      <Link to="/" className="logo">EventAI</Link>

      <div className="nav-links">
        {user.role === 'admin' && (
          <>
            <Link to="/dashboard/admin" className={isActive('/dashboard/admin')}>Users</Link>
            <Link to="/companies" className={isActive('/companies')}>Companies</Link>
            <Link to="/events" className={isActive('/events')}>Events</Link>
          </>
        )}

        {user.role === 'organizer' && (
          <>
            <Link to="/dashboard/organizer" className={isActive('/dashboard/organizer')}>Organize</Link>
            <Link to="/ai" className={`ai-btn ${isActive('/ai')}`}>🤖 AI Assistant</Link>
          </>
        )}

        {user.role === 'manager' && (
          <>
            <Link to="/dashboard/manager" className={isActive('/dashboard/manager')}>Manage</Link>
            <Link to="/ai" className={`ai-btn ${isActive('/ai')}`}>🤖 AI Assistant</Link>
          </>
        )}

        {user.role === 'staff' && (
          <Link to="/dashboard/staff" className={isActive('/dashboard/staff')}>Tasks</Link>
        )}

        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}
