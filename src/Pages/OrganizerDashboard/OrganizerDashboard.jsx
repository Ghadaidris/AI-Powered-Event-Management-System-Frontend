import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import {
  getUser,
  getCompanies,
  createCompany,
  deleteCompany,
  getEvents,
  createEvent,
  getTasks,
  createTask,
  getTeams,
  createTeam,
  getAISuggestions
} from '../../utilities/users-api';
import './OrganizerDashboard.css';

export default function OrganizerDashboard() {
  const [user, setUser] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);

  // Forms
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);

  const [formCompany, setFormCompany] = useState({ name: '', description: '' });
  const [formEvent, setFormEvent] = useState({ title: '', date: '', venue: '', company: '' });
  const [formTask, setFormTask] = useState({ title: '', assignee: '', event: '' });
  const [formTeam, setFormTeam] = useState({ name: '', event: '' });

  useEffect(() => {
    getUser().then(setUser);
    getCompanies().then(setCompanies);
    getEvents().then(setEvents);
    getTasks().then(setTasks);
    getTeams().then(setTeams);
  }, []);

  // === Companies ===
  const handleCreateCompany = async () => {
    const newCompany = await createCompany(formCompany);
    setCompanies([...companies, newCompany]);
    setFormCompany({ name: '', description: '' });
    setShowCompanyForm(false);
  };

  const handleDeleteCompany = async (id) => {
    await deleteCompany(id);
    setCompanies(companies.filter(c => c.id !== id));
  };

  // === Events ===
  const handleCreateEvent = async () => {
    const newEvent = await createEvent(formEvent);
    setEvents([...events, newEvent]);
    setFormEvent({ title: '', date: '', venue: '', company: '' });
    setShowEventForm(false);
  };

  // === Tasks ===
  const handleCreateTask = async () => {
    const newTask = await createTask(formTask);
    setTasks([...tasks, newTask]);
    setFormTask({ title: '', assignee: '', event: '' });
    setShowTaskForm(false);
  };

  // === Teams ===
  const handleCreateTeam = async () => {
    const newTeam = await createTeam(formTeam);
    setTeams([...teams, newTeam]);
    setFormTeam({ name: '', event: '' });
    setShowTeamForm(false);
  };

  // === AI Suggestion ===
  const handleAISuggestion = async (eventId) => {
    const suggestion = await getAISuggestions(eventId);
    alert(`🤖 AI Suggestion:\n${suggestion.message}`);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-container organizer">
        <header className="dashboard-header">
          <h1>Organizer Dashboard</h1>
          <p>Welcome, <strong>{user?.username}</strong>!</p>
        </header>

        {/* Companies Section */}
        <section className="section">
          <h2>Companies</h2>
          <button onClick={() => setShowCompanyForm(true)} className="btn-add">+ Add Company</button>
          {showCompanyForm && (
            <div className="form-modal">
              <input placeholder="Name" value={formCompany.name} onChange={e => setFormCompany({...formCompany, name: e.target.value})}/>
              <textarea placeholder="Description" value={formCompany.description} onChange={e => setFormCompany({...formCompany, description: e.target.value})}/>
              <button onClick={handleCreateCompany}>Save</button>
              <button onClick={() => setShowCompanyForm(false)}>Cancel</button>
            </div>
          )}
          <div className="grid">
            {companies.map(c => (
              <div key={c.id} className="card">
                <h3>{c.name}</h3>
                <p>{c.description}</p>
                <button onClick={() => handleDeleteCompany(c.id)} className="btn-delete">Delete</button>
              </div>
            ))}
          </div>
        </section>

        {/* Events Section */}
        <section className="section">
          <h2>Events</h2>
          <button onClick={() => setShowEventForm(true)} className="btn-add">+ Create Event</button>
          {showEventForm && (
            <div className="form-modal">
              <input placeholder="Title" value={formEvent.title} onChange={e => setFormEvent({...formEvent, title: e.target.value})}/>
              <input type="date" value={formEvent.date} onChange={e => setFormEvent({...formEvent, date: e.target.value})}/>
              <input placeholder="Venue" value={formEvent.venue} onChange={e => setFormEvent({...formEvent, venue: e.target.value})}/>
              <select value={formEvent.company} onChange={e => setFormEvent({...formEvent, company: e.target.value})}>
                <option value="">Select Company</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button onClick={handleCreateEvent}>Save</button>
              <button onClick={() => setShowEventForm(false)}>Cancel</button>
            </div>
          )}
          <div className="grid">
            {events.map(e => (
              <div key={e.id} className="card">
                <h3>{e.title}</h3>
                <p>Date: {e.date}</p>
                <p>Venue: {e.venue}</p>
                <div className="card-actions">
                  <button onClick={() => handleAISuggestion(e.id)}>🤖 AI Suggest</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tasks Section */}
        <section className="section">
          <h2>Tasks</h2>
          <button onClick={() => setShowTaskForm(true)} className="btn-add">+ Add Task</button>
          {showTaskForm && (
            <div className="form-modal">
              <input placeholder="Task Title" value={formTask.title} onChange={e => setFormTask({...formTask, title: e.target.value})}/>
              <select value={formTask.event} onChange={e => setFormTask({...formTask, event: e.target.value})}>
                <option value="">Select Event</option>
                {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
              </select>
              <input placeholder="Assignee (Staff Name)" value={formTask.assignee} onChange={e => setFormTask({...formTask, assignee: e.target.value})}/>
              <button onClick={handleCreateTask}>Add Task</button>
              <button onClick={() => setShowTaskForm(false)}>Cancel</button>
            </div>
          )}
          <div className="grid">
            {tasks.map(t => (
              <div key={t.id} className="card">
                <h3>{t.title}</h3>
                <p>Assigned to: {t.assignee}</p>
                <p>Event: {events.find(e => e.id === t.event)?.title || 'N/A'}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Teams Section */}
        <section className="section">
          <h2>Teams</h2>
          <button onClick={() => setShowTeamForm(true)} className="btn-add">+ Create Team</button>
          {showTeamForm && (
            <div className="form-modal">
              <input placeholder="Team Name" value={formTeam.name} onChange={e => setFormTeam({...formTeam, name: e.target.value})}/>
              <select value={formTeam.event} onChange={e => setFormTeam({...formTeam, event: e.target.value})}>
                <option value="">Select Event</option>
                {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
              </select>
              <button onClick={handleCreateTeam}>Create</button>
              <button onClick={() => setShowTeamForm(false)}>Cancel</button>
            </div>
          )}
          <div className="grid">
            {teams.map(t => (
              <div key={t.id} className="card">
                <h3>{t.name}</h3>
                <p>Event: {events.find(e => e.id === t.event)?.title || 'N/A'}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
