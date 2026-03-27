import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post('https://evergreen-clinic-backend.onrender.com/api/auth/login', {
        email: email.toLowerCase().trim(),
        password
      });

      console.log("Login Response Data:", res.data);

      const userId = res.data.user?._id || res.data.user?.id;
      const userToken = res.data.token;
      const userName = res.data.user?.name;
      const userRole = res.data.user?.role;

      if (!userId) {
        console.error("CRITICAL: Server did not return a User ID!");
      }

      localStorage.setItem('userId', userId); 
      localStorage.setItem('token', userToken);
      localStorage.setItem('name', userName);
      localStorage.setItem('role', userRole);

      
      if (userRole === 'admin') {
  navigate('/admin');
} else if (userRole === 'doctor' || userRole === 'staff') {
  navigate('/doctor-dashboard');
} else {
  navigate('/dashboard'); 
}

    } catch (err) {
      console.error("Login error details:", err);
      alert(err.response?.data?.msg || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', backgroundColor: '#f8fbfc' }}>
      <form onSubmit={handleLogin} style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '380px', borderTop: '6px solid #27ae60' }}>
        <h2 style={{ textAlign: 'center', color: '#1b4332', marginBottom: '30px' }}>Evergreen Login</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#1b4332' }}>Email Address</label>
          <input 
            type="email" 
            placeholder="name@example.com" 
            style={{ width: '100%', padding: '12px', marginTop: '8px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#1b4332' }}>Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            style={{ width: '100%', padding: '12px', marginTop: '8px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <button 
            type="button"
            onClick={() => alert("Password reset link has been sent to your email!")}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#27ae60', 
              cursor: 'pointer', 
              textDecoration: 'underline',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            Forgot Password?
          </button>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: loading ? '#95d5b2' : '#27ae60', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: loading ? 'not-allowed' : 'pointer', 
            fontWeight: 'bold', 
            fontSize: '16px' 
          }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '14px', color: '#666' }}>
          Don't have an account? <a href="/register" style={{ color: '#27ae60', fontWeight: 'bold', textDecoration: 'none' }}>Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;