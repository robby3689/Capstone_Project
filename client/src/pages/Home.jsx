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
    <div style={{ minHeight: '85vh' }}>
      <section
        style={{
          position: 'relative',
          minHeight: '420px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '60px 24px',
          backgroundImage:
            'linear-gradient(105deg, rgba(27, 67, 50, 0.92) 0%, rgba(39, 174, 96, 0.55) 100%), url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ maxWidth: '720px' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', margin: '0 0 16px', fontWeight: 800, lineHeight: 1.2 }}>
            Evergreen Clinic
          </h1>
          <p style={{ fontSize: '1.15rem', opacity: 0.95, margin: '0 0 28px', lineHeight: 1.6 }}>
            Compassionate healthcare in Highbury—where your family&apos;s health grows with you.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              style={{
                backgroundColor: primaryGreen,
                color: 'white',
                padding: '14px 28px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '16px',
              }}
            >
              Join Us
            </Link>
            <Link
              to="/login"
              style={{
                backgroundColor: 'white',
                color: darkGreen,
                padding: '14px 28px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '16px',
              }}
            >
              Patient Login
            </Link>
            <Link
              to="/services"
              style={{
                border: '2px solid white',
                color: 'white',
                padding: '12px 26px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '16px',
              }}
            >
              Our Services
            </Link>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#f8fbfc', padding: '72px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ color: darkGreen, textAlign: 'center', fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '12px' }}>
            Our medical pillars
          </h2>
          <p style={{ color: '#52796f', textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px', fontSize: '17px', lineHeight: 1.6 }}>
            These principles shape how we care for every patient who walks through our doors.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
            }}
          >
            {pillars.map((p) => (
              <div
                key={p.title}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '14px',
                  padding: '28px 24px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  borderTop: `4px solid ${primaryGreen}`,
                }}
              >
                <h3 style={{ color: darkGreen, margin: '0 0 12px', fontSize: '1.15rem' }}>{p.title}</h3>
                <p style={{ color: '#555', margin: 0, lineHeight: 1.65, fontSize: '15px' }}>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
