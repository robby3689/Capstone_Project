import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = (localStorage.getItem('role') || '').toLowerCase();
  
  const isPatient = role === 'patient' || role === 'user';
  const isDoctor = role === 'doctor';
  const isAdmin = role === 'admin';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navStyle = { display: 'flex', justifyContent: 'space-between', padding: '15px 60px', backgroundColor: '#ffffff', borderBottom: '1px solid #eee', alignItems: 'center', position: 'sticky', top: '0', zIndex: '1000' };
  const linkStyle = { color: '#444', textDecoration: 'none', marginLeft: '25px', fontSize: '15px', fontWeight: '500' };

  return (
    <nav style={navStyle}>
      <Link to="/" style={{ fontSize: '24px', fontWeight: '800', color: '#1b4332', textDecoration: 'none' }}>
        <span style={{ color: '#27ae60' }}>Evergreen</span> Clinic
      </Link>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {token ? (
          <>
            <Link style={linkStyle} to="/">Home</Link>
            {isPatient && (
              <>
                <Link style={{ ...linkStyle, color: '#27ae60' }} to="/dashboard">Dashboard</Link>
                <Link style={linkStyle} to="/appointments">Book Appointment</Link>
              </>
            )}
            {isAdmin && <Link style={{ ...linkStyle, color: '#f39c12' }} to="/admin?tab=appointments">Admin Panel</Link>}
            {isDoctor && <Link style={{ ...linkStyle, color: '#3498db' }} to="/doctor-dashboard?tab=appointments">Doctor Panel</Link>}
            <Link style={linkStyle} to="/profile">Profile</Link>
            <button onClick={handleLogout} style={{ marginLeft: '25px', padding: '8px 18px', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '6px', background: 'none', cursor: 'pointer' }}>Logout</button>
          </>
        ) : (
          <>
            <Link style={linkStyle} to="/login">Login</Link>
            <Link style={{ ...linkStyle, backgroundColor: '#27ae60', color: 'white', padding: '10px 20px', borderRadius: '6px' }} to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;