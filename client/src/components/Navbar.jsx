import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 60px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #eee',
    alignItems: 'center',
    position: 'sticky',
    top: '0',
    zIndex: '1000'
  };

  const linkStyle = {
    color: '#444',
    textDecoration: 'none',
    marginLeft: '25px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer'
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    left: '0',
    backgroundColor: 'white',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    padding: '10px 0',
    minWidth: '200px',
    display: showDropdown ? 'block' : 'none',
    zIndex: '1001',
    border: '1px solid #eee'
  };

  const dropdownItemStyle = {
    padding: '10px 20px',
    textDecoration: 'none',
    color: '#444',
    display: 'block',
    fontSize: '14px'
  };

  const emergencyBtn = {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginRight: '25px',
    fontSize: '14px'
  };

  return (
    <nav style={navStyle}>
      <Link to={token ? "/home" : "/"} style={{ fontSize: '24px', fontWeight: '800', color: '#1b4332', textDecoration: 'none' }}>
        <span style={{ color: '#27ae60' }}>Evergreen</span> Clinic
      </Link>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <a href="tel:911" style={emergencyBtn}>EMERGENCY 24/7</a>

        {token ? (
          <>
            <Link style={linkStyle} to="/home">Home</Link>

            <div 
              style={{ position: 'relative', marginLeft: '25px' }}
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <span style={{ ...linkStyle, marginLeft: 0 }}>Services</span>
              <div style={dropdownStyle}>
                <Link to="/services" style={dropdownItemStyle}>Emergency Care</Link>
                <Link to="/services" style={dropdownItemStyle}>Cardiology</Link>
                <Link to="/services" style={dropdownItemStyle}>Pediatrics</Link>
                <Link to="/services" style={dropdownItemStyle}>Diagnostics & Lab</Link>
                <Link to="/services" style={dropdownItemStyle}>General Surgery</Link>
                <Link to="/services" style={dropdownItemStyle}>Vaccination</Link>
              </div>
            </div>

            {role !== 'Admin' && (
              <Link style={linkStyle} to="/book">Book Appointment</Link>
            )}

            {role === 'Admin' && (
              <Link style={{ ...linkStyle, color: '#f39c12', fontWeight: 'bold' }} to="/admin">Admin Panel</Link>
            )}

            <Link style={linkStyle} to="/profile">Profile</Link>

            <button 
              onClick={handleLogout} 
              style={{ marginLeft: '25px', padding: '8px 18px', backgroundColor: 'transparent', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
            >
              Logout
            </button>
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