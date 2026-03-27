import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'patient' 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = 'https://evergreen-clinic-backend.onrender.com/api';

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return alert("Passwords do not match!");
    
    setLoading(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role.toLowerCase() 
    };

    try {
      await axios.post(`${API_BASE_URL}/auth/register`, payload);
      alert("Registration Successful! Please login.");
      navigate('/login');
    } catch (err) {
      console.error("Register Error:", err.response?.data);
      alert(err.response?.data?.msg || "Registration failed. Please check the console.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', backgroundColor: '#f8fbfc', minHeight: '80vh' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', width: '100%', maxWidth: '450px', borderTop: '6px solid #27ae60' }}>
        <h2 style={{ color: '#1b4332', textAlign: 'center', marginBottom: '10px' }}>Create Account</h2>
        <form onSubmit={handleRegister}>
          <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Registering as:</label>
          <select 
            style={inputStyle} 
            value={formData.role} 
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          >
            <option value="patient">Patient / Client</option>
            <option value="doctor">Doctor / Staff</option>
            <option value="admin">System Admin</option>
          </select>
          <input type="text" placeholder="Full Name" style={inputStyle} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <input type="email" placeholder="Email Address" style={inputStyle} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <input type="password" placeholder="Password" style={inputStyle} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          <input type="password" placeholder="Confirm Password" style={inputStyle} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
          
          <button 
            type="submit" 
            disabled={loading} 
            style={{ width: '100%', padding: '14px', backgroundColor: loading ? '#ccc' : '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {loading ? 'Creating Account...' : 'Register Now'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#27ae60', fontWeight: 'bold' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};
export default Register;