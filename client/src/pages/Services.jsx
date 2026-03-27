import React, { useState } from 'react';

const Services = () => {
  const [expandedId, setExpandedId] = useState(null);
  const darkGreen = '#1b4332';
  const primaryGreen = '#27ae60';

  const services = [
    { id: 1, title: "Cardiology", desc: "Heart health and surgery.", doctor: "Dr. Elena Rodriguez", detail: "Advanced diagnostics and cardiac care.", icon: "❤️" },
    { id: 2, title: "Pediatrics", desc: "Child and infant healthcare.", doctor: "Dr. Sarah Chen", detail: "Wellness checkups and vaccinations.", icon: "🧒" },
    { id: 3, title: "Emergency", desc: "24/7 Urgent medical care.", doctor: "Dr. James Miller", detail: "Trauma and acute care unit.", icon: "🚑" },
    { id: 4, title: "Diagnostics", desc: "Lab and imaging services.", doctor: "Dr. Robert Vance", detail: "X-ray, MRI, and blood analysis.", icon: "🔬" }
  ];

  return (
    <div style={{ backgroundColor: '#f8fbfc', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: darkGreen, marginBottom: '50px' }}>Our Specialized Departments</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {services.map((s) => (
            <div 
              key={s.id} 
              onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
              style={{ 
                backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', cursor: 'pointer', transition: '0.3s',
                borderTop: `5px solid ${primaryGreen}`, transform: expandedId === s.id ? 'scale(1.02)' : 'none'
              }}
              onMouseEnter={(e) => { if(expandedId !== s.id) e.currentTarget.style.transform = 'translateY(-10px)'; }}
              onMouseLeave={(e) => { if(expandedId !== s.id) e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{fontSize:'35px', marginBottom:'10px'}}>{s.icon}</div>
              <h3 style={{color: darkGreen}}>{s.title}</h3>
              <p style={{color: '#666'}}>{s.desc}</p>
              {expandedId === s.id && (
                <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f1f8f5', borderRadius: '10px', animation: 'fadeIn 0.4s' }}>
                  <strong>Lead Specialist: {s.doctor}</strong>
                  <p style={{fontSize: '14px', margin: '10px 0 0 0'}}>{s.detail}</p>
                </div>
              )}
              <div style={{ marginTop: '15px', fontSize: '12px', color: primaryGreen, fontWeight: 'bold' }}>
                {expandedId === s.id ? "CLICK TO CLOSE" : "CLICK FOR DETAILS"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Services;