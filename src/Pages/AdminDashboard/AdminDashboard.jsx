// frontend/src/pages/adminDashboard/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { getProfiles, getCompanies, getEvents } from '../../utilities/users-api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, companies: 0, events: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProfiles().catch(() => []),
      getCompanies().catch(() => []),
      getEvents().catch(() => [])
    ]).then(([p, c, e]) => {
      setStats({ users: p.length, companies: c.length, events: e.length });
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <div className="stats">
        <div className="stat-card"><h3>Users</h3><p>{stats.users}</p></div>
        <div className="stat-card"><h3>Companies</h3><p>{stats.companies}</p></div>
        <div className="stat-card"><h3>Events</h3><p>{stats.events}</p></div>
      </div>
    </div>
  );
}