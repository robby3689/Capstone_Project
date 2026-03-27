import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = (localStorage.getItem('role') || '').toLowerCase().trim();
  
  // SECURE CHECKS
  const isPatient = role === 'patient'; // Sachin only matches this
  const isDoctor = role === 'doctor';
  const isAdmin = role === 'admin'; // Only Admin matches this

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const linkStyle = { color: '#444', textDecoration: 'none', marginLeft: '25px', fontSize: '15px', fontWeight: '600' };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 60px', backgroundColor: '#fff', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 1000 }}>
      <Link to="/" style={{ fontSize: '24px', fontWeight: '800', color: '#1b4332', textDecoration: 'none' }}>
        <span style={{ color: '#27ae60' }}>Evergreen</span> Clinic
      </Link>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {token ? (
          <>
            <Link style={linkStyle} to="/">Home</Link>
            
            {/* SACHIN SEES ONLY THIS */}
            {isPatient && (
              <>
                <Link style={{ ...linkStyle, color: '#27ae60' }} to="/dashboard">My Health</Link>
                <Link style={linkStyle} to="/appointments">Book Visit</Link>
              </>
            )}

            {/* ONLY ADMIN SEES THIS */}
            {isAdmin && <Link style={{ ...linkStyle, color: '#f39c12' }} to="/admin">Admin Panel</Link>}

            {/* ONLY DOCTOR SEES THIS */}
            {isDoctor && <Link style={{ ...linkStyle, color: '#3498db' }} to="/doctor-dashboard">Doctor Panel</Link>}

            <Link style={linkStyle} to="/profile">Profile</Link>
            <button onClick={handleLogout} style={{ marginLeft: '25px', padding: '8px 15px', background: 'none', border: '1px solid #e74c3c', color: '#e74c3c', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
          </>
        ) : (
          <>
            <Link style={linkStyle} to="/login">Login</Link>
            <Link style={{ ...linkStyle, background: '#27ae60', color: '#fff', padding: '8px 15px', borderRadius: '5px' }} to="/register">Join Us</Link>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;