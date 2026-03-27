import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Reports from './pages/Reports';
import ForgotPassword from './pages/ForgotPassword';
import Appointments from './pages/Appointments';

const normalizeRole = (role) => (role == null ? '' : String(role)).toLowerCase().trim();

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = normalizeRole(localStorage.getItem('role'));

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles?.length) {
    const isAllowed = allowedRoles.some((r) => normalizeRole(r) === userRole);
    if (!isAllowed) return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ minHeight: '85vh' }}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:type" element={<ServiceDetail />} />

          {/* PATIENT DASHBOARD */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['patient', 'user']}>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* DOCTOR DASHBOARD */}
          <Route path="/doctor-dashboard" element={
            <ProtectedRoute allowedRoles={['doctor', 'staff']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />

          {/* ADMIN DASHBOARD */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* COMMON PROTECTED ROUTES */}
          <Route path="/book" element={<ProtectedRoute allowedRoles={['patient', 'user']}><Booking /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute allowedRoles={['patient', 'user']}><Appointments /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;