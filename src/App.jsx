import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUser } from './utilities/users-api';
import HomePage from '../src/Pages/homePage/HomePage';
import LoginPage from '../src/Pages/loginPage/LoginPage';
import AdminDashboard from '../src/Pages/AdminDashboard/AdminDashboard';
import AboutPage from '../src/Pages/aboutPage/aboutPage';
import SignUpPage from '../src/Pages/SignUpPage/SignUpPage'
import StaffDashboard from '../src/Pages/StaffDashboard/StaffDashboard'

function App() {
  const [user, setUser] = useState(null);


useEffect(() => {
    const token = localStorage.getItem('accessToken'); // ← ملاحظة الأستاذ
    if (token) {
      getUser()
        .then(data => {
          setUser({ role: data.role });
          localStorage.setItem('role', data.role);
        })
        .catch(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('role');
        });
    }
  
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage setUser={setUser} />} />
      <Route path="/signup" element={<SignUpPage setUser={setUser} />}/>
      

      {/* Admin Route */}
      {user?.role === 'admin' ? (
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
      ) : (
        <Route path="/dashboard/admin" element={<Navigate to="/login" />} />
      )}

      {/* Staff Route */}
      {user?.role === 'staff' ? (
        <Route path="/dashboard/staff" element={<StaffDashboard />} />
      ) : (
        <Route path="/dashboard/staff" element={<Navigate to="/login" />} />
      )}
      
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;