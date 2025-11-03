// frontend/src/pages/adminDashboard/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { getProfiles, getCompanies, getEvents, updateProfile } from '../../utilities/users-api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, companies: 0, events: 0 });
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProfiles().catch(() => []),
      getCompanies().catch(() => []),
      getEvents().catch(() => [])
    ]).then(([profilesData, companiesData, eventsData]) => {
      setProfiles(profilesData);
      setStats({
        users: profilesData.length,
        companies: companiesData.length,
        events: eventsData.length
      });
      setLoading(false);
    });
  }, []);

  const handleRoleChange = async (profileId, newRole) => {
    try {
      const updatedProfile = await updateProfile(profileId, { role: newRole });
      setProfiles(profiles.map(p => 
        p.id === profileId ? { ...p, role: updatedProfile.role } : p
      ));
    } catch (err) {
      alert('Failed to update role. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading Admin Panel...</div>;
  }

  return (
    <div className="dashboard-container admin">
      <header className="dashboard-header">
        <h1>Admin Control Panel</h1>
        <p>Manage users, monitor system activity, and ensure smooth operations.</p>
      </header>

      {/* Stats Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">Users</div>
          <h3>Total Users</h3>
          <p className="stat-number">{stats.users}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">Companies</div>
          <h3>Companies</h3>
          <p className="stat-number">{stats.companies}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">Events</div>
          <h3>Active Events</h3>
          <p className="stat-number">{stats.events}</p>
        </div>
      </section>

      {/* Users Management Table */}
      <section className="users-management">
        <div className="section-header">
          <h2>User Role Management</h2>
          <p>Assign appropriate roles to ensure proper access control.</p>
        </div>

        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Current Role</th>
                <th>Assign New Role</th>
              </tr>
            </thead>
            <tbody>
              {profiles.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-data">No users found.</td>
                </tr>
              ) : (
                profiles.map(profile => (
                  <tr key={profile.id}>
                    <td>
                      <strong>{profile.username}</strong>
                    </td>
                    <td>{profile.email}</td>
                    <td>
                      <span className={`role-badge ${profile.role}`}>
                        {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                      </span>
                    </td>
                    <td>
                      <select
                        value={profile.role}
                        onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                        className="role-select"
                        disabled={profile.role === 'admin'} // لا يمكن تغيير admin
                      >
                        <option value="staff">Staff</option>
                        <option value="organizer">Organizer</option>
                        <option value="manager">Manager</option>
                        <option value="admin" disabled>Admin (Locked)</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn primary">Create New User</button>
          <button className="action-btn secondary">View System Logs</button>
          <button className="action-btn danger">Delete Inactive Users</button>
        </div>
      </section>
    </div>
  );
}