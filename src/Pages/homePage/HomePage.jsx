// frontend/src/pages/homePage/HomePage.jsx
import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-container">
      <div className="hero">
        <h1>AI-Powered Event Management System</h1>
        <p>Organize smarter. Save time. Amaze your audience.</p>
        <div className="cta-buttons">
          <Link to="/login" className="btn-primary">Login</Link>
          <Link to="/about" className="btn-secondary">About</Link>
          <Link to="/signup" className="btn-primary">Sign Up</Link>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="icon">🎯</div>
          <h3>Smart Management</h3>
          <p>Companies, Staff, Events — all in one place</p>
        </div>
        <div className="feature-card">
          <div className="icon">🔒</div>
          <h3>Role-Based Access</h3>
          <p>Each user sees only what they need</p>
        </div>
        <div className="feature-card">
          <div className="icon">🚀</div>
          <h3>AI-Powered</h3>
          <p>Smart suggestions and automation</p>
        </div>
      </div>
    </div>
  );
}