import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getUser, getTeams, getMissions, getEvents, getProfiles, aiSplitMission, approveMission } from '../../utilities/users-api';
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

  // تم التصليح: الـ Tab يظهر صح
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
  const teamMissions = selectedTeam ? missions.filter(m => m.team === selectedTeam.id) : [];

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="dashboard-container manager">
        <header className="dashboard-header">
          <h1>Manager Dashboard</h1>
          <p>Hi, <strong>{user?.username}</strong>! Manage your teams & missions.</p>
        </header>

        {/* === Teams Tab === */}
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
                  {/* تم حذف زر + Add Member */}
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
                        {!m.ai_split && (
                          <button onClick={() => aiSplitMission(m.id)} className="btn-ai">
                            AI Split
                          </button>
                        )}
                        {m.ai_split && !m.approved && (
                          <>
                            <button onClick={() => approveMission(m.id)} className="btn-approve">
                              Approve
                            </button>
                            <button className="btn-edit">Edit AI Plan</button>
                            <button className="btn-ai">Re-Suggest AI</button>
                          </>
                        )}
                        {m.approved && <span className="status approved">Approved</span>}
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

        {/* === Events Tab === */}
        {currentTab === 'events' && (
          <section className="section">
            <h2>Managed Events</h2>
            <div className="grid">
              {events.filter(e => teams.some(t => t.event === e.id && t.manager === user?.id)).map(e => (
                <div key={e.id} className="card">
                  <h3>{e.title}</h3>
                  <p><strong>Date:</strong> {new Date(e.date).toLocaleDateString()}</p>
                  <p><strong>Location:</strong> {e.location}</p>
                  <p><strong>Teams:</strong> {teams.filter(t => t.event === e.id).map(t => t.name).join(', ')}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* === AI Suggestions Tab === */}
        {currentTab === 'ai' && (
          <section className="section">
            <h2>AI Suggestions History</h2>
            <p>Coming soon: View past AI plans and re-use them.</p>
          </section>
        )}
      </div>
    </>
  );
}