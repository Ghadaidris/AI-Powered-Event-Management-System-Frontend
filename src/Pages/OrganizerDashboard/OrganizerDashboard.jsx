import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import {
  getUser, getCompanies, createCompany, deleteCompany,
  getEvents, createEvent, deleteEvent,
  getTeams, createTeam, deleteTeam,
  getProfiles, getMissions, createMission, deleteMission,
  aiSuggestMission
} from '../../utilities/users-api';
import './OrganizerDashboard.css';

export default function OrganizerDashboard() {
  const [user, setUser] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [missions, setMissions] = useState([]);
  const [profiles, setProfiles] = useState([]);

  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showMissionForm, setShowMissionForm] = useState(false);

  const [formCompany, setFormCompany] = useState({ name: '' });
  const [formEvent, setFormEvent] = useState({ title: '', date: '', location: '', company: '' });
  const [formTeam, setFormTeam] = useState({ name: '', event: '', manager: '', members: [] });
  const [formMission, setFormMission] = useState({ title: '', description: '', event: '', team: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [u, comps, evs, tms, missionsList, profs] = await Promise.all([
          getUser(), getCompanies(), getEvents(), getTeams(), getMissions(), getProfiles()
        ]);
        setUser(u);
        setCompanies(comps);
        setEvents(evs);
        setTeams(tms);
        setMissions(missionsList);
        setProfiles(profs);
      } catch (err) {
        console.error('Failed to load data:', err);
        alert('Error loading data. Make sure the backend is running.');
      }
    };
    fetchData();
  }, []);

  // === Create Handlers ===
  const handleCreateCompany = async () => {
    if (!formCompany.name.trim()) return alert('Company name is required');
    try {
      const newCompany = await createCompany(formCompany);
      setCompanies(prev => [...prev, newCompany]);
      setFormCompany({ name: '' });
      setShowCompanyForm(false);
    } catch { alert('Failed to create company'); }
  };

  const handleCreateEvent = async () => {
    if (!formEvent.title || !formEvent.date || !formEvent.location) return alert('Fill all event fields');
    try {
      const newEvent = await createEvent({
        ...formEvent,
        company: formEvent.company ? parseInt(formEvent.company) : null
      });
      setEvents(prev => [...prev, newEvent]);
      setFormEvent({ title: '', date: '', location: '', company: '' });
      setShowEventForm(false);
    } catch { alert('Failed to create event'); }
  };

  const handleCreateTeam = async () => {
    if (!formTeam.name || !formTeam.event || !formTeam.manager) return alert('Team name, event, and manager are required');
    try {
      const payload = {
        name: formTeam.name,
        event: parseInt(formTeam.event),
        manager: parseInt(formTeam.manager),
        members: formTeam.members.map(id => parseInt(id))
      };
      const newTeam = await createTeam(payload);
      setTeams(prev => [...prev, newTeam]);
      setFormTeam({ name: '', event: '', manager: '', members: [] });
      setShowTeamForm(false);
    } catch { alert('Failed to create team'); }
  };

  const handleCreateMission = async () => {
    if (!formMission.title || !formMission.event || !formMission.team) return alert('Mission title, event, and team are required');
    try {
      const newMission = await createMission({
        ...formMission,
        event: parseInt(formMission.event),
        team: parseInt(formMission.team)
      });
      setMissions(prev => [...prev, newMission]);
      setFormMission({ title: '', description: '', event: '', team: '' });
      setShowMissionForm(false);
      alert('Mission added successfully!');
    } catch { alert('Failed to create mission'); }
  };

  // === AI Suggest Mission ===
  const handleAISuggest = async (eventId) => {
    try {
      const suggestion = await aiSuggestMission(eventId);
      setFormMission({
        title: suggestion.title,
        description: suggestion.description,
        event: eventId.toString(),
        team: suggestion.team ? suggestion.team.toString() : ''
      });
      setShowMissionForm(true);
    } catch (err) {
      console.error(err);
      alert('AI Suggestion failed');
    }
  };

  // === Delete Handlers ===
  const handleDeleteCompany = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    try {
      await deleteCompany(id);
      setCompanies(prev => prev.filter(c => c.id !== id));
    } catch { alert('Failed to delete company. It might be linked to events.'); }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch { alert('Failed to delete event. Check if there are related tasks or teams.'); }
  };

  const handleDeleteTeam = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    try {
      await deleteTeam(id);
      setTeams(prev => prev.filter(t => t.id !== id));
    } catch { alert('Failed to delete team. Check if there are related tasks.'); }
  };

  const handleDeleteMission = async (id) => {
    if (!window.confirm('Are you sure you want to delete this mission?')) return;
    try {
      await deleteMission(id);
      setMissions(prev => prev.filter(m => m.id !== id));
    } catch { alert('Failed to delete mission.'); }
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Organizer Dashboard</h1>
          <p>Welcome back, <strong>{user.username}</strong>!</p>
        </header>

        {/* Companies */}
        <section className="section">
          <h2>Companies</h2>
          <button onClick={() => setShowCompanyForm(true)} className="btn-add">+ Add Company</button>
          {showCompanyForm && (
            <div className="form-modal">
              <input placeholder="Company Name" value={formCompany.name} onChange={e => setFormCompany({ name: e.target.value })} />
              <button onClick={handleCreateCompany}>Save</button>
              <button onClick={() => setShowCompanyForm(false)}>Cancel</button>
            </div>
          )}
          <div className="grid">
            {companies.map(c => (
              <div key={c.id} className="card">
                <h3>{c.name}</h3>
                <button onClick={() => handleDeleteCompany(c.id)} className="btn-delete">Delete</button>
              </div>
            ))}
          </div>
        </section>

        {/* Events */}
        <section className="section">
          <h2>Events</h2>
          <button onClick={() => setShowEventForm(true)} className="btn-add">+ Create Event</button>
          {showEventForm && (
            <div className="form-modal">
              <input placeholder="Event Title" value={formEvent.title} onChange={e => setFormEvent({ ...formEvent, title: e.target.value })} />
              <input type="date" value={formEvent.date} onChange={e => setFormEvent({ ...formEvent, date: e.target.value })} />
              <input placeholder="Location" value={formEvent.location} onChange={e => setFormEvent({ ...formEvent, location: e.target.value })} />
              <select value={formEvent.company} onChange={e => setFormEvent({ ...formEvent, company: e.target.value })}>
                <option value="">No Company</option>
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
                <p><strong>Date:</strong> {new Date(e.date).toLocaleDateString()}</p>
                <p><strong>Location:</strong> {e.location}</p>
                <button onClick={() => handleAISuggest(e.id)} className="btn-ai">AI Suggest Mission</button>
                <button onClick={() => handleDeleteEvent(e.id)} className="btn-delete">Delete Event</button>
              </div>
            ))}
          </div>
        </section>

        {/* Teams */}
        <section className="section">
          <h2>Teams</h2>
          <button onClick={() => setShowTeamForm(true)} className="btn-add">+ Create Team</button>
          {showTeamForm && (
            <div className="form-modal">
              <input placeholder="Team Name" value={formTeam.name} onChange={e => setFormTeam({ ...formTeam, name: e.target.value })} />
              <select value={formTeam.event} onChange={e => setFormTeam({ ...formTeam, event: e.target.value })}>
                <option value="">Select Event</option>
                {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
              </select>
              <select value={formTeam.manager} onChange={e => setFormTeam({ ...formTeam, manager: e.target.value })}>
                <option value="">Select Manager</option>
                {profiles.filter(p => p.role === 'manager').map(m => (
                  <option key={m.id} value={m.id}>{m.username}</option>
                ))}
              </select>
              <div className="team-members-section">
                <p>Select Staff Members:</p>
                <div className="checkbox-container">
                  {profiles.filter(p => p.role === 'staff').map(s => (
                    <label key={s.id} className="checkbox-label">
                      <input type="checkbox"
                        checked={formTeam.members.includes(s.id.toString())}
                        onChange={e => {
                          const checked = e.target.checked;
                          setFormTeam(prev => ({
                            ...prev,
                            members: checked
                              ? [...prev.members, s.id.toString()]
                              : prev.members.filter(id => id !== s.id.toString())
                          }));
                        }}
                      />
                      <span>{s.username}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={handleCreateTeam}>Create Team</button>
              <button onClick={() => setShowTeamForm(false)}>Cancel</button>
            </div>
          )}
          <div className="grid">
            {teams.map(t => (
              <div key={t.id} className="card">
                <h3>{t.name}</h3>
                <p><strong>Manager:</strong> {profiles.find(p => p.id === t.manager)?.username || 'N/A'}</p>
                <p><strong>Event:</strong> {events.find(e => e.id === t.event)?.title || 'N/A'}</p>
                <p><strong>Members:</strong> {t.members?.map(id => profiles.find(p => p.id === id)?.username).join(', ') || 'No members'}</p>
                <button onClick={() => handleDeleteTeam(t.id)} className="btn-delete">Delete</button>
              </div>
            ))}
          </div>
        </section>

        {/* Missions */}
        <section className="section">
          <h2>Missions</h2>
          <button onClick={() => setShowMissionForm(true)} className="btn-add">+ Add Mission</button>
          {showMissionForm && (
            <div className="form-modal">
              <input placeholder="Mission Title" value={formMission.title} onChange={e => setFormMission({ ...formMission, title: e.target.value })} />
              <textarea placeholder="Description (optional)" value={formMission.description} onChange={e => setFormMission({ ...formMission, description: e.target.value })} />
              <select value={formMission.event} onChange={e => setFormMission({ ...formMission, event: e.target.value })}>
                <option value="">Select Event</option>
                {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
              </select>
              <select value={formMission.team} onChange={e => setFormMission({ ...formMission, team: e.target.value })}>
                <option value="">Assign to Team</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <button onClick={handleCreateMission}>Add Mission</button>
              <button onClick={() => setShowMissionForm(false)}>Cancel</button>
            </div>
          )}
          <div className="grid">
            {missions.map(m => (
              <div key={m.id} className="card">
                <h3>{m.title || 'No Title'}</h3>
                <p>{m.description || 'No Description'}</p>
                <p><strong>Event:</strong> {events.find(e => e.id === m.event)?.title || 'N/A'}</p>
                <p><strong>Team:</strong> {teams.find(t => t.id === m.team)?.name || 'N/A'}</p>
                <button onClick={() => handleDeleteMission(m.id)} className="btn-delete">Delete</button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
