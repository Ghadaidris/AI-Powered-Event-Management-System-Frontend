// frontend/src/pages/loginPage/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../utilities/users-api';
import './LoginPage.css';

export default function LoginPage({ setUser }) {
    const [creds, setCreds] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(creds);
            console.log({ data })
            localStorage.setItem('token', data.access);
            localStorage.setItem('role', data.role);
            setUser({ role: data.role });
            navigate('/dashboard/admin');
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        placeholder="Username"
                        value={creds.username}
                        onChange={e => setCreds({ ...creds, username: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={creds.password}
                        onChange={e => setCreds({ ...creds, password: e.target.value })}
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}