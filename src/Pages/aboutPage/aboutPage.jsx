// frontend/src/pages/aboutPage/AboutPage.jsx
import { Link } from 'react-router-dom';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <div className="about-container">
      <Link to="/" className="back-btn">Back to Home</Link>

      <h1>About EventAI</h1>
      <p>
        <strong>EventAI</strong> is a modern, role-based event management system built from scratch using <strong>React</strong> and <strong>Django REST Framework</strong>. 
        It empowers teams to organize, manage, and execute events with precision — all while maintaining strict access control.
      </p>

      <h2>Why I Built This</h2>
      <p>
        I wanted to create a system where every user sees <em>only what they need</em>:  
        Admins control everything, Organizers plan events, Managers track progress, and Staff execute tasks — seamlessly.
      </p>

      <h2>Favorite Code Snippet</h2>
      <p>
        My favorite part is the <strong>dynamic navbar</strong> — it changes instantly based on the user's role:
      </p>
      <pre className="code-snippet">
{`<nav>
  {user?.role === 'admin' && <Link to="/dashboard/admin">Admin</Link>}
  {user?.role === 'organizer' && <Link to="/dashboard/organizer">Organizer</Link>}
</nav>`}
      </pre>

      <h2>Tech Stack</h2>
      <div className="tech-stack">
        <div className="tech">React</div>
        <div className="tech">Django REST</div>
        <div className="tech">JWT Auth</div>
        <div className="tech">Glassmorphism UI</div>
        <div className="tech">Responsive Design</div>
      </div>

      <p className="footer-note">
        Built with passion for clean code, smart UX, and scalable systems.<br />
        <strong>Future: AI-powered task suggestions</strong> (coming soon).
      </p>
    </div>
  );
}