import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUser, logout } from '../../utilities/users-api';
import './HomePage.css';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [displayText, setDisplayText] = useState('');
  const navigate = useNavigate();
  const heroTexts = [
    'Organize smarter.',
    'Save time.',
    'Amaze your audience.',
    'AI-Powered Event Management.'
  ];

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      getUser().then(data => setUser({ username: data.username, role: data.role }))
               .catch(() => {
                 localStorage.removeItem('access');
                 localStorage.removeItem('role');
               });
    }

    // Typing effect
    let currentIndex = 0;
    let charIndex = 0;
    let forward = true;

    const typeInterval = setInterval(() => {
      if (!heroTexts[currentIndex]) return;

      if (forward) {
        setDisplayText(heroTexts[currentIndex].slice(0, charIndex + 1));
        charIndex++;
        if (charIndex === heroTexts[currentIndex].length) forward = false;
      } else {
        charIndex--;
        setDisplayText(heroTexts[currentIndex].slice(0, charIndex));
        if (charIndex === 0) {
          forward = true;
          currentIndex = (currentIndex + 1) % heroTexts.length;
        }
      }
    }, 120);

    return () => clearInterval(typeInterval);
  }, []);

  // Scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.feature-card, .footer').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleLogout = () => {

    localStorage.removeItem('access');
    localStorage.removeItem('role');
    setUser(null);
   
    navigate('/');
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">EventAI</Link>
        <div className="nav-links">
          <Link to="/about">About</Link>
          {user ? (
            <>
              <span className="welcome">Hi, {user.username}!</span>
              {user.role === 'admin' && <Link to="/dashboard/admin" className="dash-link">Admin</Link>}
              {user.role === 'organizer' && <Link to="/dashboard/organizer" className="dash-link">Organizer</Link>}
              {user.role === 'manager' && <Link to="/dashboard/manager" className="dash-link">Manager</Link>}
              {user.role === 'staff' && <Link to="/dashboard/staff" className="dash-link">Staff</Link>}
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-nav">Login</Link>
              <Link to="/signup" className="btn-nav">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section with floating icons */}
      <div className="hero">
        <div className="floating-icons">
          <span className="icon float1">🎯</span>
          <span className="icon float2">🚀</span>
          <span className="icon float3">💡</span>
          <span className="icon float4">🛠️</span>
        </div>

        <h1>EventAI</h1>
        <p className="typing">{displayText}</p>
        <div className="cta-buttons">
          {!user && (
            <>
              <Link to="/login" className="btn-primary">Login</Link>
              <Link to="/signup" className="btn-primary">Sign Up</Link>
            </>
          )}
          <Link to="/about" className="btn-secondary">Learn More</Link>
        </div>
      </div>

      {/* Features */}
      <div className="features">
        <div className="feature-card">
          <div className="icon">🎯</div>
          <h3>Smart Task Management</h3>
          <p>Organize companies, events, and staff — all in one intelligent platform</p>
        </div>
        <div className="feature-card">
          <div className="icon">🔒</div>
          <h3>Role-Based Security</h3>
          <p>Admin, Organizer, Manager, Staff — each sees only what they need</p>
        </div>
        <div className="feature-card">
          <div className="icon">🚀</div>
          <h3>AI-Powered Automation</h3>
          <p>Let AI suggest task distribution, teams, and optimal workflows</p>
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
    </div>
  );
}
