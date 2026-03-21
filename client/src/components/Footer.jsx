import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerStyle = {
    backgroundColor: '#1b4332',
    color: '#f1f8f5',
    padding: '60px 20px 20px 20px',
    marginTop: '80px',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '40px'
  };

  const columnStyle = {
    flex: '1',
    minWidth: '200px'
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#27ae60' 
  };

  const linkStyle = {
    color: '#adb5bd',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '10px',
    fontSize: '14px'
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        
        <div style={columnStyle}>
          <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '15px' }}>
            Evergreen <span style={{ color: '#27ae60' }}>Clinic</span>
          </div>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#adb5bd' }}>
            Providing world-class healthcare with a focus on long-term wellness and 
            patient-centered care.
          </p>
        </div>

        <div style={columnStyle}>
          <div style={titleStyle}>Quick Links</div>
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/book" style={linkStyle}>Book Appointment</Link>
          <Link to="/login" style={linkStyle}>Patient Portal</Link>
        </div>

        <div style={columnStyle}>
          <div style={titleStyle}>Contact Us</div>
          <p style={linkStyle}>205 Humber College Blvd, Etobicoke</p>
          <p style={linkStyle}> (416) 555-0199</p>
          <p style={linkStyle}> care@evergreenclinic.ca</p>
        </div>

        <div style={columnStyle}>
          <div style={titleStyle}>Opening Hours</div>
          <p style={linkStyle}>Mon - Fri: 8:00 AM - 6:00 PM</p>
          <p style={linkStyle}>Sat: 9:00 AM - 2:00 PM</p>
          <p style={linkStyle}>Sun: Closed</p>
        </div>

      </div>

      <div style={{ 
        textAlign: 'center', 
        marginTop: '50px', 
        paddingTop: '20px', 
        borderTop: '1px solid rgba(255,255,255,0.1)', 
        fontSize: '12px',
        color: '#52796f'
      }}>
        © 2026 Evergreen Clinic Highbury. All Rights Reserved. Designed by Sachin Singh.
      </div>
    </footer>
  );
};

export default Footer;