// frontend/src/Pages/ManagerDashboard/ManagerDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, getEvents } from '../../utilities/users-api';
import Navbar from '../../components/Navbar';
import './ManagerDashboard.css';

export default function ManagerDashboard() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUser().then(setUser).catch(() => {});
    getEvents().then(setEvents).catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <div className="dashboard-container manager">
        {/* ===== Header ===== */}
        <header className="dashboard-header">
          <h1>Manager Dashboard</h1>
          <p className="welcome">
            Hello, <strong>{user?.username || 'Manager'}</strong>! Monitor, assign, and optimize your events.
          </p>
        </header>

        {/* ===== Action Buttons ===== */}
        <section className="actions-grid">
          <button className="action-card" onClick={() => navigate('/dashboard/manager/events')}>
            <div className="icon">📋</div>
            <h3>View Managed Events</h3>
            <p>Track progress and team performance</p>
          </button>

          <button className="action-card ai-suggestion">
            <div className="icon">🧠</div>
            <h3>Modify AI Task Distribution</h3>
            <p>Adjust or enhance suggested assignments</p>
          </button>

          <button className="action-card" onClick={() => navigate('/dashboard/manager/assign')}>
            <div className="icon">👥</div>
            <h3>Assign Members to Teams</h3>
            <p>Organize staff efficiently</p>
          </button>

          <button className="action-card ai-request">
            <div className="icon">✨</div>
            <h3>Request AI Suggestions</h3>
            <p>Get new smart recommendations</p>
          </button>
        </section>

        {/* ===== Managed Events Section ===== */}
        <section className="event-list">
          <h2>🗂 Your Managed Events</h2>
          {events.length > 0 ? (
            <ul>
              {events.map((event) => (
                <li key={event.id} className="event-item">
                  <h4>{event.name}</h4>
                  <p>{event.description}</p>
                  <span>Status: {event.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-events">No events assigned yet.</p>
          )}
        </section>

        {/* ===== Quick Stats Section ===== */}
        <div className="quick-stats">
          <div className="stat-mini"><span>7</span> Events in Progress</div>
          <div className="stat-mini"><span>4</span> Teams Active</div>
          <div className="stat-mini"><span>98%</span> Task Completion</div>
        </div>

        {/* ===== Floating AI Button ===== */}
        <button className="floating-ai-btn" title="AI Assistant 🤖">
          🤖
        </button>
      </div>
    </>
  );
}
