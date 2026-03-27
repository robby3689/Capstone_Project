import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  const [expandedId, setExpandedId] = useState(null);
  const darkGreen = '#1b4332';
  const primaryGreen = '#27ae60';
  const emergencyRed = '#e74c3c';

  const services = [
    { id: 1, title: "Emergency Care", desc: "24/7 Acute care for urgent injuries.", doctor: "Dr. James Miller", detail: "Our trauma unit is equipped with life-support systems and rapid-response surgical teams.", color: emergencyRed },
    { id: 2, title: "Cardiology", desc: "Heart screenings and specialized cardiac care.", doctor: "Dr. Elena Rodriguez", detail: "Specializing in non-invasive diagnostics, ECG monitoring, and hypertension management.", color: primaryGreen },
    { id: 3, title: "Pediatrics", desc: "Healthcare for infants and children.", doctor: "Dr. Sarah Chen", detail: "Providing a child-friendly environment for immunizations and developmental checkups.", color: primaryGreen },
    { id: 4, title: "Diagnostics & Lab", desc: "Accurate blood work and medical imaging.", doctor: "Dr. Robert Vance", detail: "State-of-the-art MRI and blood analysis with results available within 24 hours.", color: primaryGreen },
    { id: 5, title: "General Surgery", desc: "Inpatient and outpatient procedures.", doctor: "Dr. Kevin Thorne", detail: "Minimally invasive laparoscopic techniques for faster recovery times.", color: primaryGreen },
    { id: 6, title: "Vaccination", desc: "Flu shots and standard immunizations.", doctor: "Nurse Practitioner Lisa Jo", detail: "Comprehensive travel vaccines and pediatric immunization tracking.", color: primaryGreen }
  ];

  return (
    <div style={{ backgroundColor: '#f8fbfc', minHeight: '100vh', padding: '80px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ color: darkGreen, fontSize: '42px', marginBottom: '20px' }}>Specialized Departments</h1>
          <p style={{ color: '#52796f', maxWidth: '750px', margin: '0 auto', fontSize: '19px' }}>
            Click on a department to meet our lead specialist and see service details.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginBottom: '80px' }}>
          {services.map((s) => (
            <div 
              key={s.id} 
              onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
              style={{ 
                backgroundColor: 'white', padding: '35px', borderRadius: '16px', boxShadow: '0 8px 25px rgba(0,0,0,0.05)', textAlign: 'center', 
                cursor: 'pointer', transition: 'all 0.3s ease', borderTop: `6px solid ${s.color}`,
                transform: expandedId === s.id ? 'scale(1.02)' : 'none',
                height: 'fit-content'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = expandedId === s.id ? 'scale(1.02)' : 'translateY(0)'}
            >
              <h3 style={{ color: darkGreen, marginBottom: '15px' }}>{s.title}</h3>
              <p style={{ color: '#777', lineHeight: '1.6' }}>{s.desc}</p>
              
              {expandedId === s.id && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f1f8f5', borderRadius: '10px', animation: 'fadeIn 0.4s ease' }}>
                  <p style={{ fontWeight: 'bold', color: primaryGreen, margin: '0 0 10px' }}>Specialist: {s.doctor}</p>
                  <p style={{ fontSize: '14px', color: '#444', margin: 0 }}>{s.detail}</p>
                </div>
              )}
              <div style={{ marginTop: '15px', fontSize: '12px', color: primaryGreen, fontWeight: 'bold' }}>
                {expandedId === s.id ? "CLOSE DETAILS" : "LEARN MORE"}
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Banner */}
        <div style={{ backgroundColor: darkGreen, color: 'white', padding: '50px', borderRadius: '24px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '30px', marginBottom: '10px' }}>Need Urgent Help?</h2>
            <p style={{ opacity: '0.9' }}>Our team is ready to assist you 24 hours a day.</p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <a href="tel:911" style={{ backgroundColor: emergencyRed, color: 'white', padding: '15px 30px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}>CALL 911</a>
            <Link to="/book" style={{ backgroundColor: 'white', color: darkGreen, padding: '15px 30px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}>Book Appointment</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;