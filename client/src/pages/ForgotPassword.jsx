import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '350px', textAlign: 'center' }}>
        <h2 style={{ color: '#1b4332' }}>Reset Password</h2>
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>Enter your email to receive a reset link.</p>
            <input type="email" placeholder="Email Address" required style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Send Reset Link</button>
          </form>
        ) : (
          <div>
            <p style={{ color: '#27ae60', fontWeight: 'bold' }}>Reset link sent to {email}</p>
            <p style={{ fontSize: '13px' }}>Please check your inbox (and spam folder).</p>
          </div>
        )}
        <Link to="/login" style={{ display: 'block', marginTop: '20px', color: '#666', fontSize: '14px' }}>Back to Login</Link>
      </div>
    </div>
  );
};
export default ForgotPassword;