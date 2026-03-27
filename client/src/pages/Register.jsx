import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    role: 'patient' 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = 'https://evergreen-clinic-backend.onrender.com/api';

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }
    
    setLoading(true);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
      role: formData.role 
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, payload);
      
      console.log("Registration Success:", response.data);
      alert("Registration Successful! Redirecting to login...");
      navigate('/login');

    } catch (err) {
      console.error("Register Error Object:", err.response?.data);
      
      const errorMessage = err.response?.data?.msg || 
                           err.response?.data?.error || 
                           "Registration failed. Please check your internet or try a different email.";
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { 
    width: '100%', 
    padding: '12px', 
    marginBottom: '15px', 
    borderRadius: '8px', 
    border: '1px solid #ddd', 
    boxSizing: 'border-box' 
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', backgroundColor: '#f8fbfc', minHeight: '80vh' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', width: '100%', maxWidth: '450px', borderTop: '6px solid #27ae60' }}>
        <h2 style={{ color: '#1b4332', textAlign: 'center', marginBottom: '20px' }}>Create Account</h2>
        
        <form onSubmit={handleRegister}>
          <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#1b4332' }}>Registering as:</label>
          <select 
            style={inputStyle} 
            value={formData.role} 
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          >
            <option value="patient">Patient / Client</option>
            <option value="doctor">Doctor / Staff</option>
            <option value="admin">System Admin</option>
          </select>

          <input 
            type="text" 
            placeholder="Full Name" 
            style={inputStyle} 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
          />
          
          <input 
            type="email" 
            placeholder="Email Address" 
            style={inputStyle} 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            style={inputStyle} 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required 
          />
          
          <input 
            type="password" 
            placeholder="Confirm Password" 
            style={inputStyle} 
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
            required 
          />
          
          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              width: '100%', 
              padding: '14px', 
              backgroundColor: loading ? '#95d5b2' : '#27ae60', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold',
              fontSize: '16px',
              marginTop: '10px',
              transition: 'background-color 0.3s'
            }}
          >
            {loading ? 'Creating Account...' : 'Register Now'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
          Already have an account? <Link to="/login" style={{ color: '#27ae60', fontWeight: 'bold', textDecoration: 'none' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;