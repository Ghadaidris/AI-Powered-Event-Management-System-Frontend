
import { useEffect, useState } from 'react';
import { getUser } from '../../utilities/users-api';
import './ManagerDashboard.css';

export default function ManagerDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser().then(setUser).catch(() => {});
  }, []);

  return (
    <div className="dashboard-container manager">
      <header className="dashboard-header">
        <h1>Manager Dashboard</h1>
        <p className="welcome">Hello, <strong>{user?.username}</strong>! Monitor, assign, and optimize.</p>
      </header>

      <section className="actions-grid">
        <button className="action-card">
          <div className="icon">List</div>
          <h3>View All Events</h3>
          <p>Track progress across all projects</p>
        </button>

        <button className="action-card ai-suggestion">
          <div className="icon">Brain</div>
          <h3>Modify AI Task Distribution</h3>
          <p>Fine-tune AI-generated assignments</p>
        </button>

        <button className="action-card">
          <div className="icon">Users</div>
          <h3>Assign Staff to Teams</h3>
          <p>Build the perfect team for each event</p>
        </button>
      </section>

      <div className="quick-stats">
        <div className="stat-mini">
          <span>7</span> Events in Progress
        </div>
        <div className="stat-mini">
          <span>4</span> Teams Active
        </div>
        <div className="stat-mini">
          <span>98%</span> Task Completion
        </div>
      </div>
    </div>
  );
}