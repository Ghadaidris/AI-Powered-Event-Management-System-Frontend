import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUser } from './utilities/users-api';
import HomePage from './Pages/homePage/HomePage';
import LoginPage from './Pages/loginPage/LoginPage';
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard';
import AboutPage from './Pages/aboutPage/AboutPage';
import SignUpPage from './Pages/SignUpPage/SignUpPage';
import StaffDashboard from './Pages/StaffDashboard/StaffDashboard';
import OrganizerDashboard from './Pages/OrganizerDashboard/OrganizerDashboard';
import ManagerDashboard from './Pages/ManagerDashboard/ManagerDashboard';
import CompanyList from './Pages/CompanyList/CompanyList';
import EventList from './Pages/EventList/EventList';
import TeamsPage from './Pages/TeamsPage/TeamsPage'

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access');
    console.log({token})
    if (token) {
      getUser()
        .then(data => {
          setUser({ role: data.role, username: data.username });
          localStorage.setItem('role', data.role);
        })
        .catch(() => {
          localStorage.removeItem('access');
          localStorage.removeItem('role');
          setUser(null);
        });
    }
  }, []);

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<HomePage user={user} setUser={setUser} />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage setUser={setUser} user={user} />} />
      <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
      <Route path="/companies" element={<CompanyList />} />
      <Route path="/events" element={<EventList />} />
      <Route path="/teams" element={<TeamsPage />} />


      {/* Role-based Dashboards */}
      <Route
        path="/dashboard/admin"
        element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard/staff"
        element={user?.role === 'staff' ? <StaffDashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard/organizer"
        element={user?.role === 'organizer' ? <OrganizerDashboard /> : <Navigate to="/login" />}
      />

      {/* ✅ Manager Dashboard and Subpages */}
      <Route
        path="/dashboard/manager"
        element={user?.role === 'manager' ? <ManagerDashboard /> : <Navigate to="/login" />}
      />
      
      {/* Catch-all */}
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
