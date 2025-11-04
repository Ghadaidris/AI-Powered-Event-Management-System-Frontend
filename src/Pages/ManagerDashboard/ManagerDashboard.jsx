import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  getUser, getTeams, getMissions, getEvents, getProfiles, 
  aiSplitMission, approveMission 
} from '../../utilities/users-api';
import Navbar from '../../components/Navbar';
import './ManagerDashboard.css';

export default function ManagerDashboard() {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [missions, setMissions] = useState([]);
  const [events, setEvents] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const pathParts = location.pathname.split('/');
  const currentTab = pathParts[pathParts.length - 1] === 'manager' ? 'teams' : pathParts[pathParts.length - 1];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [u, tms, mss, evs, profs] = await Promise.all([
          getUser(), getTeams(), getMissions(), getEvents(), getProfiles()
        ]);

        const teamsWithNames = tms.map(team => ({
          ...team,
          member_names: profs.filter(p => team.members.includes(p.id)).map(p => p.username)
        }));

        setUser(u);
        setTeams(teamsWithNames);
        setMissions(mss);
        setEvents(evs);
        setProfiles(profs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const myTeams = teams.filter(t => t.manager === user?.id);
  const teamMissions = selectedTeam 
    ? missions.filter(m => m.team === selectedTeam.id)
    : [];

  const handleAISplit = async (missionId) => {
    try {
      await aiSplitMission(missionId);
      const updated = await getMissions();
      setMissions(updated);
      alert('Mission split by AI successfully!');
    } catch (err) {
      alert('Failed to split mission with AI');
    }
  };

  const handleApprove = async (missionId, updatedSubtasks = []) => {
    try {
      const updates = updatedSubtasks.map(t => ({ id: t.id, title: t.title }));
      await approveMission(missionId, updates);
      const updated = await getMissions();
      setMissions(updated);
      alert('Mission approved and tasks updated!');
    } catch (err) {
      alert('Failed to approve mission');
    }
  };

  const updateSubtaskTitle = (missionId, taskId, newTitle) => {
    setMissions(prev => prev.map(m => 
      m.id === missionId 
        ? { ...m, subtasks: m.subtasks.map(st => st.id === taskId ? { ...st, title: newTitle } : st) }
        : m
    ));
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="dashboard-container manager">
        <header className="dashboard-header">
          <h1>Manager Dashboard</h1>
          <p>Hi, <strong>{user?.username}</strong>! Manage your teams & missions.</p>
        </header>

        {currentTab === 'teams' && (
          <section className="section">
            <h2>Your Teams</h2>
            <div className="grid">
              {myTeams.map(team => (
                <div
                  key={team.id}
                  className={`card ${selectedTeam?.id === team.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTeam(team)}
                >
                  <h3>{team.name}</h3>
                  <p><strong>Event:</strong> {events.find(e => e.id === team.event)?.title || 'N/A'}</p>
                  <p><strong>Members:</strong> {team.member_names.join(', ')}</p>
                </div>
              ))}
            </div>

            {selectedTeam && (
              <div className="modal-overlay" onClick={() => setSelectedTeam(null)}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                  <button className="close-btn" onClick={() => setSelectedTeam(null)}>×</button>
                  <h2>{selectedTeam.name} - Missions</h2>
                  {teamMissions.length > 0 ? (
                    teamMissions.map(m => (
                      <div key={m.id} className="mission-card">
                        <h4>{m.title}</h4>

                        {/* AI Split Button */}
                        {!m.ai_split && (
                          <button onClick={() => handleAISplit(m.id)} className="btn-ai">
                            AI Split
                          </button>
                        )}

                        {/* AI Split Done → Show Subtasks + Edit + Approve */}
                        {m.ai_split && !m.is_approved && (
                          <div className="ai-plan">
                            <h5>AI Suggested Subtasks:</h5>
                            {m.subtasks?.length > 0 ? (
                              <ul>
                                {m.subtasks.map((t) => (
                                  <li key={t.id}>
                                    <strong>{profiles.find(p => p.id === t.assignee)?.username}:</strong>
                                    <input
                                      type="text"
                                      defaultValue={t.title}
                                      onChange={(e) => updateSubtaskTitle(m.id, t.id, e.target.value)}
                                      style={{ marginLeft: '8px', padding: '4px' }}
                                    />
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p>No subtasks generated.</p>
                            )}

                            <div className="actions">
                              <button 
                                onClick={() => handleApprove(m.id, m.subtasks)}
                                className="btn-approve"
                              >
                                Approve Plan
                              </button>
                              <button className="btn-ai" onClick={() => handleAISplit(m.id)}>
                                Re-Suggest AI
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Approved */}
                        {m.is_approved && <span className="status approved">Approved</span>}
                      </div>
                    ))
                  ) : (
                    <p>No missions assigned to this team.</p>
                  )}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
}