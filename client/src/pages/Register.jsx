import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'Patient'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }
    
    setLoading(true);
    try {
      // Use Localhost for testing right now
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert("Registration Successful! Please login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', backgroundColor: '#f8fbfc', minHeight: '80vh' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', width: '100%', maxWidth: '450px', borderTop: '6px solid #27ae60' }}>
        <h2 style={{ color: '#1b4332', textAlign: 'center', marginBottom: '10px' }}>Create Account</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Join Evergreen Clinic Highbury</p>
        
        <form onSubmit={handleRegister}>
          <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>Register as:</label>
          <select style={inputStyle} value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="Patient">Patient</option>
            <option value="Doctor">Doctor / Medical Staff</option>
            <option value="Admin">Administrator</option>
          </select>

          <input type="text" placeholder="Full Name" style={inputStyle} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <input type="email" placeholder="Email Address" style={inputStyle} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <input type="password" placeholder="Password" style={inputStyle} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          <input type="password" placeholder="Confirm Password" style={inputStyle} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', backgroundColor: loading ? '#ccc' : '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
            {loading ? 'Processing...' : 'Register Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;