import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name') || 'Patient';
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const darkGreen = '#1b4332';
  const primaryGreen = '#27ae60';
  const lightBg = '#f8fbfc';

  const getDashboardLink = () => {
    if (role === 'Admin') return '/admin';
    if (role === 'Doctor') return '/doctor-dashboard';
    return '/dashboard';
  };

  const cardStyle = {
    backgroundColor: 'white', padding: '40px 30px', borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center',
    flex: '1', margin: '0 15px', borderTop: `6px solid ${primaryGreen}`
  };

  return (
    <div style={{ backgroundColor: lightBg, minHeight: '100vh' }}>
      <div style={{ padding: '80px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white' }}>
        <div style={{ flex: '1', paddingRight: '40px' }}>
          <h1 style={{ fontSize: '52px', color: darkGreen, marginBottom: '20px', fontWeight: '800' }}>
            {token ? `Welcome Back, ${name}` : 'Healthcare Excellence in Highbury'}
          </h1>
          <p style={{ fontSize: '19px', color: '#52796f', marginBottom: '40px', lineHeight: '1.6' }}>
            Evergreen Clinic provides integrated medical services, from primary care to 
            advanced diagnostics. Manage your health journey 24/7 through our digital portal.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {token ? (
              <button 
                onClick={() => navigate(getDashboardLink())} 
                style={{ padding: '16px 40px', backgroundColor: primaryGreen, color: 'white', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '17px' }}
              >
                Go to My Dashboard
              </button>
            ) : (
              <>
                <Link to="/register" style={{ padding: '16px 40px', backgroundColor: primaryGreen, color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>Register Now</Link>
                <Link to="/login" style={{ padding: '16px 40px', backgroundColor: 'transparent', color: darkGreen, border: `2px solid ${darkGreen}`, borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>Member Login</Link>
              </>
            )}
          </div>
        </div>
        <div style={{ flex: '0.9', height: '450px', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000" alt="Clinic" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      <div style={{ padding: '80px 60px', textAlign: 'center' }}>
        <h2 style={{ color: darkGreen, fontSize: '32px', marginBottom: '50px' }}>Our Medical Pillars</h2>
        <div style={{ display: 'flex' }}>
          <div style={cardStyle}><h3>Family Medicine</h3><p>Comprehensive care for all ages.</p></div>
          <div style={cardStyle}><h3>Diagnostics</h3><p>Instant digital lab results.</p></div>
          <div style={cardStyle}><h3>Emergency</h3><p>24/7 Priority medical response.</p></div>
        </div>
      </div>
    </div>
  );
};
export default Home;