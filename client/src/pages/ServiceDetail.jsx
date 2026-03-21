import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ServiceDetail = () => {
  const { type } = useParams();
  const darkGreen = '#1b4332';
  const primaryGreen = '#27ae60';

  const serviceData = {
    'cardiology': {
      title: 'Department of Cardiology',
      experience: '15 Years of Excellence',
      description: 'Our cardiology department is equipped with the latest diagnostic technology for heart health. We specialize in non-invasive testing and long-term cardiac care.',
      doctors: [
        { name: 'Dr. Sarah Mitchell', specialty: 'Senior Cardiologist', education: 'Harvard Medical' },
        { name: 'Dr. James Wilson', specialty: 'Interventional Cardiology', education: 'Johns Hopkins' }
      ]
    },
    'emergency': {
      title: 'Emergency Response Unit',
      experience: '24/7 Rapid Response',
      description: 'Providing immediate medical intervention for critical conditions. Our trauma center is ranked among the best in the province for speed and accuracy.',
      doctors: [
        { name: 'Dr. Robert Chen', specialty: 'ER Specialist', education: 'University of Toronto' }
      ]
    },
    'pediatrics': {
      title: 'Pediatric Care Center',
      experience: '10 Years of Compassionate Care',
      description: 'Dedicated to the health and well-being of children from birth through adolescence. We offer a child-friendly environment to make visits stress-free.',
      doctors: [
        { name: 'Dr. Emily Blunt', specialty: 'Consultant Pediatrician', education: 'Oxford Medical' }
      ]
    }
  };

  const current = serviceData[type?.toLowerCase()] || serviceData['emergency'];

  return (
    <div style={{ padding: '60px 20px', backgroundColor: '#f8fbfc', minHeight: '85vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: 'white', padding: '50px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <Link to="/services" style={{ color: primaryGreen, textDecoration: 'none', fontWeight: 'bold' }}>← Back to All Services</Link>
        
        <h1 style={{ color: darkGreen, marginTop: '20px', fontSize: '36px' }}>{current.title}</h1>
        <p style={{ color: primaryGreen, fontWeight: 'bold', fontSize: '18px' }}>{current.experience}</p>
        
        <hr style={{ margin: '30px 0', border: 'none', borderBottom: '1px solid #eee' }} />
        
        <h3 style={{ color: darkGreen }}>About the Department</h3>
        <p style={{ color: '#555', lineHeight: '1.8', fontSize: '16px' }}>{current.description}</p>

        <h3 style={{ color: darkGreen, marginTop: '40px' }}>Specialist Team</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
          {current.doctors.map((doc, i) => (
            <div key={i} style={{ padding: '20px', backgroundColor: '#f1f8f5', borderRadius: '12px' }}>
              <h4 style={{ margin: '0 0 5px 0', color: darkGreen }}>{doc.name}</h4>
              <p style={{ margin: '0', fontSize: '14px', color: primaryGreen, fontWeight: 'bold' }}>{doc.specialty}</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#888' }}>{doc.education}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '50px', textAlign: 'center' }}>
          <Link to="/book" style={{ backgroundColor: primaryGreen, color: 'white', padding: '15px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
            Book an Appointment with this Department
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;