// frontend/src/pages/signupPage/SignUpPage.jsx
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../utilities/users-api';
import './SignUpPage.css';

const token = localStorage.getItem('access');
export default function SignUpPage({ setUser }) {
    const [creds, setCreds] = useState({
        username: '',
        email: '',
        password: '',
        confirm: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (creds.password !== creds.confirm) {
            setError('Passwords do not match');
            return;
        }
        if (!creds.email.includes('@')) {
            setError('Please enter a valid email');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const data = await signup({
                username: creds.username,
                email: creds.email,
                password: creds.password
            });

            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('accessRole', data.role || 'staff');
            setUser({ role: data.role || 'staff' });
            navigate('/dashboard/staff');
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.error || 'Failed to create account. Try another username or email.');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (token) navigate("/")
      }, [])

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2>Staff Sign Up</h2>
                <p className="subtitle">Create a new staff account</p>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={creds.username}
                        onChange={e => setCreds({ ...creds, username: e.target.value })}
                        required
                        minLength="3"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={creds.email}
                        onChange={e => setCreds({ ...creds, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={creds.password}
                        onChange={e => setCreds({ ...creds, password: e.target.value })}
                        required
                        minLength="6"
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={creds.confirm}
                        onChange={e => setCreds({ ...creds, confirm: e.target.value })}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Sign Up'}
                    </button>
                </form>
                <p className="login-link">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
}