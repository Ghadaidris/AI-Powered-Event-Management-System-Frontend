
import { useEffect, useState } from 'react';
import { getUser } from '../../utilities/users-api';
import { Link } from 'react-router-dom';
import './OrganizerDashboard.css';

export default function OrganizerDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser().then(setUser).catch(() => {});
  }, []);

  return (
    <div className="dashboard-container organizer">
      <header className="dashboard-header">
        <h1>Organizer Dashboard</h1>
        <p className="welcome">Welcome back, <strong>{user?.username}</strong>! Let's plan something amazing.</p>
      </header>

      <section className="actions-grid">
        <Link to="/companies/new" className="action-card">
          <div className="icon">Building</div>
          <h3>Add New Company</h3>
          <p>Register a new partner or client</p>
        </Link>

        <Link to="/events/new" className="action-card">
          <div className="icon">Calendar</div>
          <h3>Create New Event</h3>
          <p>Start planning your next big moment</p>
        </Link>

        <button className="action-card ai-suggestion">
          <div className="icon">Brain</div>
          <h3>Request AI Suggestions</h3>
          <p>Get smart team & task recommendations</p>
        </button>
      </section>

      <div className="quick-stats">
        <div className="stat-mini">
          <span>3</span> Active Events
        </div>
        <div className="stat-mini">
          <span>12</span> Companies
        </div>
        <div className="stat-mini">
          <span>AI Ready</span> Suggestions Available
        </div>
      </div>
    </div>
  );
}