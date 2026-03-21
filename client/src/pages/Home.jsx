import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name') || 'Patient';

  const darkGreen = '#1b4332';
  const primaryGreen = '#27ae60';
  const lightBg = '#f8fbfc';

  const sectionStyle = {
    padding: '80px 60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    minHeight: '60vh'
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '40px 30px',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    textAlign: 'center',
    flex: '1',
    margin: '0 15px',
    borderTop: `6px solid ${primaryGreen}`,
    transition: '0.3s'
  };

  return (
    <div style={{ backgroundColor: lightBg, minHeight: '100vh' }}>
      
      <div style={sectionStyle}>
        <div style={{ flex: '1', paddingRight: '40px' }}>
          <h1 style={{ fontSize: '52px', color: darkGreen, marginBottom: '20px', fontWeight: '800', lineHeight: '1.1' }}>
            {token ? `Welcome Back, ${name}` : 'Advanced Healthcare for Your Family'}
          </h1>
          <p style={{ fontSize: '19px', color: '#52796f', marginBottom: '40px', maxWidth: '550px', lineHeight: '1.6' }}>
            Evergreen Clinic Highbury delivers world-class medical expertise with a personal approach. 
            Manage appointments and access digital records with ease.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {token ? (
              <Link to="/book" style={{ padding: '16px 40px', backgroundColor: primaryGreen, color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '17px' }}>
                Schedule an Appointment
              </Link>
            ) : (
              <>
                <Link to="/register" style={{ padding: '16px 40px', backgroundColor: primaryGreen, color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                  Register as Patient
                </Link>
                <Link to="/login" style={{ padding: '16px 40px', backgroundColor: 'transparent', color: darkGreen, border: `2px solid ${darkGreen}`, borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                  Member Login
                </Link>
              </>
            )}
          </div>
        </div>

        <div style={{ flex: '0.9', height: '450px', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000" 
            alt="Evergreen Medical Facility" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      <div style={{ padding: '60px', backgroundColor: '#f1f8f5', textAlign: 'center' }}>
        <h2 style={{ color: darkGreen, fontSize: '32px', marginBottom: '15px' }}>15 Years of Medical Excellence</h2>
        <p style={{ color: '#52796f', maxWidth: '800px', margin: '0 auto', fontSize: '17px', lineHeight: '1.6' }}>
          Since 2011, Evergreen Clinic has been a pillar of the Brampton community. We have served over 50,000 patients 
          with a commitment to technological innovation and compassionate care. Our facility is open 24/7 to ensure 
          that expert help is always just a moment away.
        </p>
      </div>

      <div style={{ padding: '80px 60px', textAlign: 'center' }}>
        <h2 style={{ color: darkGreen, fontSize: '32px', marginBottom: '50px' }}>Our Medical Pillars</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={cardStyle}>
            <h3 style={{ color: darkGreen, marginBottom: '15px' }}>Primary Care</h3>
            <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.6' }}>Focused on long-term wellness, routine screenings, and comprehensive family medicine.</p>
          </div>
          <div style={cardStyle}>
            <h3 style={{ color: darkGreen, marginBottom: '15px' }}>Diagnostic Lab</h3>
            <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.6' }}>State-of-the-art blood work and imaging services with secure, instant portal delivery.</p>
          </div>
          <div style={cardStyle}>
            <h3 style={{ color: darkGreen, marginBottom: '15px' }}>Emergency Unit</h3>
            <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.6' }}>Urgent care protocols designed for rapid response and priority medical intervention.</p>
          </div>
        </div>
      </div>

      <footer style={{ backgroundColor: darkGreen, color: 'white', padding: '60px', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '10px' }}>Evergreen Clinic Highbury</h3>
        <p style={{ opacity: '0.8', fontSize: '14px' }}>123 Health Street, Brampton, ON | Open 24/7 for Emergencies</p>
        <div style={{ marginTop: '20px', fontSize: '12px', opacity: '0.5' }}>© 2026 Professional Medical Portal. All Rights Reserved.</div>
      </footer>
    </div>
  );
};

export default Home;