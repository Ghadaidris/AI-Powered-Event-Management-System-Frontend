// frontend/src/pages/staffDashboard/StaffDashboard.jsx
import { useEffect, useState } from 'react';
import { getEvents } from '../../utilities/events-api';
import './StaffDashboard.css';

export default function StaffDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents()
      .then(events => {
        // نفترض إن كل Event عنده `assigned_to` = staff
        const staffTasks = events.filter(e => e.assigned_to === 'staff'); // أو حسب الـ API
        setTasks(staffTasks);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading Tasks...</div>;

  return (
    <div className="staff-dashboard">
      <h1>Staff Dashboard</h1>
      <p className="welcome">Welcome! Here are your assigned tasks:</p>

      <div className="tasks-grid">
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks assigned yet.</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="task-card">
              <h3>{task.title}</h3>
              <p><strong>Event:</strong> {task.event_name}</p>
              <p><strong>Due:</strong> {new Date(task.due_date).toLocaleDateString()}</p>
              <span className={`status ${task.status}`}>
                {task.status || 'Pending'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}