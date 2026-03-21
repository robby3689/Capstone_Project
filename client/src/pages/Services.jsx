import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  const darkGreen = '#1b4332';
  const primaryGreen = '#27ae60';
  const emergencyRed = '#e74c3c';

  const services = [
    { title: "Emergency Care", desc: "24/7 Acute care for life-threatening conditions and urgent injuries.", color: emergencyRed },
    { title: "Cardiology", desc: "Advanced heart screenings, ECGs, and specialized cardiac consultations.", color: primaryGreen },
    { title: "Pediatrics", desc: "Comprehensive healthcare for infants, children, and adolescents.", color: primaryGreen },
    { title: "Diagnostics & Lab", desc: "Fast and accurate blood work, X-rays, and medical imaging.", color: primaryGreen },
    { title: "General Surgery", desc: "Expert surgical team for both inpatient and outpatient procedures.", color: primaryGreen },
    { title: "Vaccination", desc: "Flu shots, travel vaccines, and standard immunization schedules.", color: primaryGreen }
  ];

  const cardStyle = {
    backgroundColor: 'white',
    padding: '40px 30px',
    borderRadius: '16px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
    textAlign: 'center',
    transition: '0.3s ease',
    borderTop: '6px solid'
  };

  return (
    <div style={{ backgroundColor: '#f8fbfc', minHeight: '100vh', padding: '80px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{ color: darkGreen, fontSize: '42px', marginBottom: '20px' }}>Our Specialized Departments</h1>
          <p style={{ color: '#52796f', maxWidth: '750px', margin: '0 auto', fontSize: '19px', lineHeight: '1.6' }}>
            Equipped with modern medical infrastructure to deliver excellence across these specialized fields.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginBottom: '80px' }}>
          {services.map((s, index) => (
            <div key={index} style={{ ...cardStyle, borderTopColor: s.color }}>
              <h3 style={{ color: darkGreen, marginBottom: '20px', fontSize: '22px' }}>{s.title}</h3>
              <p style={{ color: '#777', fontSize: '16px', lineHeight: '1.7', marginBottom: '10px' }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: darkGreen, color: 'white', padding: '60px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 20px 40px rgba(27, 67, 50, 0.2)' }}>
          <div>
            <h2 style={{ fontSize: '32px', marginBottom: '15px' }}>Urgent Medical Assistance</h2>
            <p style={{ opacity: '0.9', fontSize: '17px' }}>Our emergency response team is available around the clock.</p>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="tel:911" style={{ backgroundColor: emergencyRed, color: 'white', padding: '18px 35px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
              CONTACT EMERGENCY
            </a>
            <Link to="/book" style={{ backgroundColor: 'white', color: darkGreen, padding: '18px 35px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
              Schedule Regular Visit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;