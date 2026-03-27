import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role')?.toLowerCase();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navStyle = { display: 'flex', justifyContent: 'space-between', padding: '15px 60px', backgroundColor: '#ffffff', borderBottom: '1px solid #eee', alignItems: 'center', position: 'sticky', top: '0', zIndex: '1000' };
  const linkStyle = { color: '#444', textDecoration: 'none', marginLeft: '25px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' };
  const dropdownStyle = { position: 'absolute', top: '100%', left: '0', backgroundColor: 'white', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '10px 0', minWidth: '200px', display: showDropdown ? 'block' : 'none', zIndex: '1001', border: '1px solid #eee' };
  const dropdownItemStyle = { padding: '10px 20px', textDecoration: 'none', color: '#444', display: 'block', fontSize: '14px' };
  const emergencyBtn = { backgroundColor: '#e74c3c', color: 'white', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' };

  return (
    <nav style={navStyle}>
      <Link to="/" style={{ fontSize: '24px', fontWeight: '800', color: '#1b4332', textDecoration: 'none' }}>
        <span style={{ color: '#27ae60' }}>Evergreen</span> Clinic
      </Link>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <a href="tel:911" style={emergencyBtn}>EMERGENCY 24/7</a>

        <div style={{ position: 'relative', marginLeft: '25px' }} onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
          <span style={linkStyle} onClick={() => navigate('/services')}>Services</span>
          <div style={dropdownStyle}>
            <Link to="/services/emergency" style={dropdownItemStyle}>Emergency Care</Link>
            <Link to="/services/pediatrics" style={dropdownItemStyle}>Pediatrics</Link>
            <Link to="/services/diagnostics" style={dropdownItemStyle}>Diagnostics & Lab</Link>
          </div>
        </div>

        {token ? (
          <>
            <Link style={linkStyle} to="/">Home</Link>
            {role === 'admin' && <Link style={{ ...linkStyle, color: '#f39c12', fontWeight: 'bold' }} to="/admin">Admin Panel</Link>}
            {(role === 'doctor' || role === 'staff') && <Link style={{ ...linkStyle, color: '#3498db', fontWeight: 'bold' }} to="/doctor-dashboard">Doctor Panel</Link>}
            {(role === 'patient' || role === 'user') && (
              <>
                <Link style={linkStyle} to="/dashboard">My Health</Link>
                <Link style={linkStyle} to="/book">Book Appointment</Link>
              </>
            )}
            
            <Link style={linkStyle} to="/profile">Profile</Link>
            <button onClick={handleLogout} style={{ marginLeft: '25px', padding: '8px 18px', backgroundColor: 'transparent', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Logout</button>
          </>
        ) : (
          <>
            <Link style={linkStyle} to="/login">Login</Link>
            <Link style={{ ...linkStyle, padding: '10px 22px', backgroundColor: '#27ae60', color: 'white', borderRadius: '6px' }} to="/register">Join Us</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;