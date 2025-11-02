import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUser } from './utilities/users-api';
import HomePage from '../src/Pages/homePage/HomePage';
import LoginPage from '../src/Pages/loginPage/LoginPage';
import AdminDashboard from '../src/Pages/AdminDashboard/AdminDashboard';
import AboutPage from '../src/Pages/aboutPage/aboutPage';




function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUser().then(setUser).catch(() => localStorage.clear());
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage setUser={setUser} />} />
      
      {user?.role === 'admin' ? (
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
      ) : (
        <Route path="/dashboard/admin" element={<Navigate to="/login" />} />
      )}
      
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;