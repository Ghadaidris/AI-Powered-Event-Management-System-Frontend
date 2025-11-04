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
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(path) ? 'active' : '';

  if (!user) return null;

  return (
    <nav className="dashboard-navbar">
      <Link to="/" className="logo">EventAI</Link>

      <div className="nav-links">
        {/* Admin */}
        {user.role === 'admin' && (
          <>
            <Link to="/dashboard/admin" className={isActive('/dashboard/admin')}>Users</Link>
            <Link to="/companies" className={isActive('/companies')}>Companies</Link>
            <Link to="/events" className={isActive('/events')}>Events</Link>
          </>
        )}

        {/* Organizer */}
        {user.role === 'organizer' && (
          <>
            <Link to="/dashboard/organizer" className={isActive('/dashboard/organizer')}>Organize</Link>
            <Link to="/ai" className={isActive('/ai')}>AI Assistant</Link>
          </>
        )}

        {/* Manager – نُضيف Tabs داخل الـ Dashboard */}
        {user.role === 'manager' && (
          <>
            <Link to="/dashboard/manager" className={isActive('/dashboard/manager')}>Manage</Link>
            <Link to="/ai" className={isActive('/ai')}>AI Assistant</Link>
          </>
        )}

        {/* Staff */}
        {user.role === 'staff' && (
          <Link to="/dashboard/staff" className={isActive('/dashboard/staff')}>My Tasks</Link>
        )}

        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}