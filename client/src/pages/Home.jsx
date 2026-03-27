import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const darkGreen = '#1b4332';
  const primaryGreen = '#27ae60';

  const pillars = [
    { title: 'Patient-Centered Care', text: 'Every visit is guided by listening first and treating the whole person—not just symptoms.' },
    { title: 'Clinical Excellence', text: 'Board-certified physicians and modern diagnostics support safer, evidence-based decisions.' },
    { title: 'Prevention & Wellness', text: 'Screenings, vaccinations, and chronic-care planning help you stay ahead of illness.' },
    { title: 'Trusted Coordination', text: 'Seamless referrals and clear communication between departments and your care team.' },
  ];

  return (
    <div style={{ minHeight: '85vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          minHeight: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '60px 24px',
          backgroundImage: 'linear-gradient(105deg, rgba(27, 67, 50, 0.92) 0%, rgba(39, 174, 96, 0.55) 100%), url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', margin: '0 0 20px', fontWeight: 800, lineHeight: 1.1 }}>
            Better Health Starts Here
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.95, margin: '0 0 35px', lineHeight: 1.6 }}>
            Evergreen Clinic provides world-class healthcare with a local touch. 
            From emergency response to long-term wellness, we are your partners in health.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ backgroundColor: primaryGreen, color: 'white', padding: '16px 32px', borderRadius: '30px', textDecoration: 'none', fontWeight: 700 }}>Start Your Journey</Link>
            <Link to="/services" style={{ border: '2px solid white', color: 'white', padding: '14px 30px', borderRadius: '30px', textDecoration: 'none', fontWeight: 600 }}>Explore Services</Link>
          </div>
        </div>
      </section>

      {/* NEW: Long Info Section */}
      <section style={{ padding: '80px 20px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: darkGreen, fontSize: '32px', marginBottom: '20px' }}>Leading the Way in Modern Medicine</h2>
            <p style={{ lineHeight: '1.8', color: '#444', fontSize: '17px' }}>
              Evergreen Clinic has been serving the community for over two decades. We believe that technology should enhance the human touch, not replace it. Our facility integrates digital health records with face-to-face expertise.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
              {['✓ 24/7 Virtual Consultation', '✓ Advanced Imaging Suite', '✓ On-site Pharmacy'].map(item => (
                <li key={item} style={{ marginBottom: '10px', color: primaryGreen, fontWeight: 'bold' }}>{item}</li>
              ))}
            </ul>
          </div>
          <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <img src="https://images.unsplash.com/photo-1586773860418-d37222d8fce2?auto=format&fit=crop&w=800&q=80" alt="Clinic" style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* Medical Pillars */}
      <section style={{ backgroundColor: '#f8fbfc', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ color: darkGreen, textAlign: 'center', marginBottom: '50px' }}>Our Commitment to You</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px' }}>
            {pillars.map((p) => (
              <div key={p.title} style={{ backgroundColor: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderTop: `5px solid ${primaryGreen}` }}>
                <h3 style={{ color: darkGreen, marginBottom: '15px' }}>{p.title}</h3>
                <p style={{ color: '#666', lineHeight: 1.6 }}>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;