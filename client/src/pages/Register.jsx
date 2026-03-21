import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'Patient', 
    phone: '', age: '', gender: ''
  });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      setIsSuccess(true);
      alert("Registration Successful! You can now login.");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' };

  if (isSuccess) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', padding: '40px', backgroundColor: 'white', borderRadius: '16px', maxWidth: '400px', margin: '100px auto', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#27ae60' }}>Account Created</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Your Evergreen Clinic profile is ready.</p>
        <button onClick={() => navigate('/login')} style={{ padding: '12px 30px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 0', backgroundColor: '#f8fbfc' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', width: '100%', maxWidth: '500px', borderTop: '6px solid #27ae60' }}>
        <h2 style={{ color: '#1b4332', textAlign: 'center', marginBottom: '25px' }}>Join Evergreen Clinic</h2>
        
        <form onSubmit={handleRegister}>
          <label style={{ fontWeight: '600' }}>I am a...</label>
          <select style={inputStyle} value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="Patient">Patient</option>
            <option value="Doctor">Doctor / Medical Staff</option>
            <option value="Admin">Administrator</option>
          </select>

          <input type="text" placeholder="Full Name" style={inputStyle} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <input type="email" placeholder="Email Address" style={inputStyle} onChange={(e) => setFormData({...formData, email: e.target.value})} required />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <input type="number" placeholder="Age" style={inputStyle} onChange={(e) => setFormData({...formData, age: e.target.value})} />
            <select style={inputStyle} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <input type="password" placeholder="Password" style={inputStyle} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          <input type="password" placeholder="Confirm Password" style={inputStyle} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', backgroundColor: loading ? '#ccc' : '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
            {loading ? 'Processing...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;