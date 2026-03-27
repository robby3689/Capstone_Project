import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';
import Services from './pages/Services';
import DoctorDashboard from './pages/DoctorDashboard';
import ServiceDetail from './pages/ServiceDetail';
import Reports from './pages/Reports';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles) {
    // FIX: Normalizing case sensitivity
    const isAllowed = allowedRoles.some(r => r.toLowerCase() === userRole?.toLowerCase());
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
          <Route path="/" element={<Home />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:type" element={<ServiceDetail />} />
          <Route path="/home" element={<Home />} /> 
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['patient', 'user']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/book" element={
            <ProtectedRoute allowedRoles={['patient', 'user']}>
              <Booking />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/doctor-dashboard" element={
            <ProtectedRoute allowedRoles={['doctor', 'staff']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer /> 
    </Router>
  );
}

export default App;