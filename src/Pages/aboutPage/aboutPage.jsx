import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './AboutPage.css';

export default function AboutPage() {
  const teamMembers = [
    { name: 'Sam Bassong', role: 'Instructor', icon: '🧑‍🏫' },
    { name: 'Devlin Booth', role: 'Instructor', icon: '🧑‍🏫' },
    { name: 'Cynthia Castillo', role: 'Instructor', icon: '🧑‍🏫' },
    { name: 'Ghada Idris', role: 'Student', icon: '🧑‍🎓' }
  ];

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="about-hero">
        <h1>About EventAI</h1>
        <p>AI-powered platform to manage events, tasks, and teams efficiently</p>
      </div>

      {/* Project Info */}
      <div className="about-content">
        <h2>Our Mission</h2>
        <p>
          EventAI aims to simplify event management using AI automation,
          intelligent task distribution, and role-based access.
        </p>

        <h2>Why EventAI?</h2>
        <p>
          With AI suggestions, you can optimize teams, save time, and ensure
          every event runs smoothly. Suitable for Admins, Organizers, Managers, and Staff.
        </p>
      </div>

      {/* Team Section */}
      <div className="team-section">
        <h2>Meet the Team</h2>
        <div className="team-cards">
          {teamMembers.map(member => (
            <div key={member.name} className="team-card">
              <div className="team-icon">{member.icon}</div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2025 EventAI. All rights reserved.</p>
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noreferrer">🐦</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">🔗</a>
            <a href="https://github.com" target="_blank" rel="noreferrer">💻</a>
          </div>
        </div>
      </footer>
    </>
  );
}
