import { Link } from 'react-router-dom';
import './aboutPage.css';

export default function AboutPage() {
  return (
    <div className="about-container">
      <Link to="/" className="back-btn">← Back to Home</Link>
      <h1>About This System</h1>
      <p>will type sth here soon</p>
      <div className="tech-stack">
        <div className="tech">sha</div>
        <div className="tech">la</div>
        <div className="tech">la</div>
        <div className="tech">la</div>
       
      </div>
    </div>
  );
}