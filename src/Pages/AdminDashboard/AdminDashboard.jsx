// frontend/src/pages/adminDashboard/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import {
  getProfiles,
  getCompanies,
  getEvents,
  updateProfile,
  getUser
} from '../../utilities/users-api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [stats, setStats] = useState({ users: 0, companies: 0, events: 0 });
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Create User Modal State
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'staff'
  });

  // Load initial data: User, Profiles, Companies, Events
  useEffect(() => {
    const loadData = async () => {
      try {
        const [user, profilesData, companiesData, eventsData] = await Promise.all([
          getUser().catch(() => null),
          getProfiles().catch(() => []),
          getCompanies().catch(() => []),
          getEvents().catch(() => [])
        ]);

        if (user) setCurrentUserId(user.id);

        setProfiles(profilesData);
        setStats({
          users: profilesData.length,
          companies: companiesData.length,
          events: eventsData.length
        });
      } catch (err) {
        console.error('Failed to load admin data:', err);
        alert('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Update user role (Staff, Organizer, Manager)
  const handleRoleChange = async (profileId, newRole) => {
    if (profileId === currentUserId) {
      alert("You cannot change your own role!");
      return;
    }

    try {
      const updated = await updateProfile(profileId, { role: newRole });
      setProfiles(prev =>
        prev.map(p => (p.id === profileId ? { ...p, role: updated.role } : p))
      );
    } catch (err) {
      alert('Failed to update role. Please try again.');
    }
  };

  // Create new user via signup endpoint
  const handleCreateUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || 'Signup failed');
      }

      // Reset form & close modal
      setNewUser({ username: '', email: '', password: '', role: 'staff' });
      setShowCreateUser(false);

      // Refresh profiles
      const updatedProfiles = await getProfiles();
      setProfiles(updatedProfiles);
      setStats(prev => ({ ...prev, users: updatedProfiles.length }));

      alert('User created successfully!');
    } catch (err) {
      alert(err.message || 'Failed to create user');
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Loading Admin Panel...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container admin">
        {/* Header */}
        <header className="dashboard-header">
          <h1>Admin Control Panel</h1>
          <p>Manage users, monitor system activity, and ensure smooth operations.</p>
        </header>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn primary" onClick={() => setShowCreateUser(true)}>
              Create New User
            </button>
            <button className="action-btn secondary" onClick={() => navigate('/companies')}>
              Manage Companies
            </button>
            <button className="action-btn danger" onClick={() => alert('Coming soon: Delete inactive users')}>
              Delete Inactive Users
            </button>
          </div>
        </section>

        {/* Stats Grid */}
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

        {/* Users Table */}
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
                      <td><strong>{profile.username}</strong></td>
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
                          disabled={profile.id === currentUserId || profile.role === 'admin'}
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

        {/* Create User Modal */}
        {showCreateUser && (
          <div className="modal-overlay" onClick={() => setShowCreateUser(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3>Create New User</h3>
              <input
                placeholder="Username"
                value={newUser.username}
                onChange={e => setNewUser({ ...newUser, username: e.target.value })}
              />
              <input
                placeholder="Email"
                type="email"
                value={newUser.email}
                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
              />
              <select
                value={newUser.role}
                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="staff">Staff</option>
                <option value="organizer">Organizer</option>
                <option value="manager">Manager</option>
              </select>
              <div className="modal-actions">
                <button onClick={handleCreateUser} className="btn-primary">Create</button>
                <button onClick={() => setShowCreateUser(false)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}