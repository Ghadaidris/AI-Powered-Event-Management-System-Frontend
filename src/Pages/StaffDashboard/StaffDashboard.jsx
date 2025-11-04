import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import {
  getUser,
  getTasks,
  getTeams,
  getEvents,
  updateTaskStatus,
  requestTaskDeletion
} from '../../utilities/users-api';
import './StaffDashboard.css';

export default function StaffDashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const u = await getUser();
        const tks = await getTasks();
        const tms = await getTeams();
        const evs = await getEvents();

        // فلترة المهام الخاصة بالستاف فقط
        const myTasks = tks.filter(t => t.assignee === u.id);

        setUser(u);
        setTasks(myTasks);
        setTeams(tms);
        setEvents(evs);
      } catch (err) {
        console.error('Error loading staff data:', err);
        alert('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDeleteRequest = async (taskId) => {
    if (!window.confirm('Request to delete this task?')) return;
    try {
      await requestTaskDeletion(taskId);
      alert('Deletion request sent to manager');
    } catch (err) {
      alert('Failed to send request');
    }
  };

  if (loading) return <div className="loading">Loading Your Tasks...</div>;

  return (
    <>
      <Navbar />
      <div className="staff-dashboard">
        <header className="dashboard-header">
          <h1>Staff Dashboard</h1>
          <p className="welcome">
            Hello, <strong>{user?.username}</strong>! Manage your assigned tasks.
          </p>
        </header>

        <section className="section">
          <h2>Your Tasks ({tasks.length})</h2>

          {tasks.length === 0 ? (
            <div className="no-tasks">
              <p>No tasks assigned yet.</p>
              <p>Check back later or contact your manager.</p>
            </div>
          ) : (
            <div className="tasks-grid">
              {tasks.map(task => {
                const team = teams.find(t => t.id === task.team);
                const event = events.find(e => e.id === task.event);

                return (
                  <div key={task.id} className="task-card">
                    <div className="task-header">
                      <h3>{task.title}</h3>
                      <span className={`status-badge ${task.status?.toLowerCase().replace(' ', '-')}`}>
                        {task.status || 'Pending'}
                      </span>
                    </div>

                    <div className="task-details">
                      <p><strong>Team:</strong> {team?.name || 'N/A'}</p>
                      <p><strong>Event:</strong> {event?.title || 'N/A'}</p>
                      <p><strong>Mission:</strong> {task.mission_title || 'General'}</p>
                      {task.description && <p><strong>Description:</strong> {task.description}</p>}
                      {task.due_date && (
                        <p><strong>Due:</strong> {new Date(task.due_date).toLocaleDateString()}</p>
                      )}
                    </div>

                    <div className="task-actions">
                      <select
                        value={task.status || 'Pending'}
                        onChange={e => handleStatusChange(task.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Blocked">Blocked</option>
                      </select>

                      <button
                        onClick={() => handleDeleteRequest(task.id)}
                        className="btn-delete"
                      >
                        Request Delete
                      </button>
                    </div>

                    {task.ai_generated && (
                      <div className="ai-badge">
                        AI Generated
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}