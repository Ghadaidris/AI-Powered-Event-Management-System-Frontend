import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManagerDashboard.css";

export default function TeamAssignmentPage() {
  const [teams, setTeams] = useState([
    { id: 1, name: "Team Alpha", members: ["Aisha", "Fahad"] },
    { id: 2, name: "Team Beta", members: ["Omar", "Sara"] },
  ]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="dashboard-container manager">
      <header className="dashboard-header">
        <h1>👥 Team Assignment</h1>
        <p className="welcome">Assign members to teams and organize staff efficiently.</p>
      </header>

      <button className="back-btn" onClick={() => navigate("/dashboard/manager")}>
        ← Back to Dashboard
      </button>

      <section className="actions-grid">
        {teams.map((team) => (
          <div key={team.id} className="action-card" onClick={() => setSelectedTeam(team)}>
            <div className="icon">🏆</div>
            <h3>{team.name}</h3>
            <p>{team.members.length} members</p>
          </div>
        ))}
      </section>

      {selectedTeam && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedTeam.name} Members</h2>
            <ul>
              {selectedTeam.members.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>

            <button className="close-btn" onClick={() => setSelectedTeam(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
