import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '', email: '', phone: '', age: '', gender: '', password: ''
  });
  const [isEditing, setIsEditing] = useState(false); 
  
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token'); 
  
  const primaryGreen = '#27ae60';
  const darkGreen = '#1b4332';
  const dangerRed = '#e74c3c';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfileData(res.data);
      } catch (err) {
        setProfileData(prev => ({
          ...prev,
          name: localStorage.getItem('name') || '',
          email: localStorage.getItem('email') || ''
        }));
      }
    };
    if (userId) fetchProfile();
  }, [userId, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/auth/profile/${userId}`, profileData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      localStorage.setItem('name', profileData.name);
      alert("Health profile updated successfully!");
      setIsEditing(false); 
    } catch (err) { 
      console.error("Update Error:", err.response?.data);
      alert(err.response?.data?.msg || "Update failed. Check your connection or login again."); 
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure? This will delete all your records.")) {
      try {
        await axios.delete(`http://localhost:5000/api/auth/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.clear();
        navigate('/login');
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', minHeight: '80vh' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderTop: `6px solid ${primaryGreen}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: darkGreen, margin: 0 }}>Patient Profile</h2>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            style={{ padding: '8px 16px', backgroundColor: isEditing ? '#666' : primaryGreen, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {!isEditing ? (
          <div style={{ fontSize: '16px', lineHeight: '2.5' }}>
            <p><strong>Name:</strong> {profileData.name || 'Not provided'}</p>
            <p><strong>Email:</strong> {profileData.email}</p>
            <p><strong>Phone:</strong> {profileData.phone || 'Not provided'}</p>
            <p><strong>Age:</strong> {profileData.age || 'Not provided'}</p>
            <p><strong>Gender:</strong> {profileData.gender || 'Not provided'}</p>
          </div>
        ) : (
          <form onSubmit={handleUpdate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label>Full Name</label>
                <input type="text" value={profileData.name} style={inputStyle} onChange={(e) => setProfileData({...profileData, name: e.target.value})} />
              </div>
              <div>
                <label>Phone Number</label>
                <input type="text" value={profileData.phone} style={inputStyle} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} />
              </div>
              <div>
                <label>Age</label>
                <input type="number" value={profileData.age} style={inputStyle} onChange={(e) => setProfileData({...profileData, age: e.target.value})} />
              </div>
              <div>
                <label>Gender</label>
                <select value={profileData.gender} style={inputStyle} onChange={(e) => setProfileData({...profileData, gender: e.target.value})}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <label>New Password (Optional)</label>
            <input type="password" placeholder="Leave blank to keep current" style={inputStyle} onChange={(e) => setProfileData({...profileData, password: e.target.value})} />
            
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: darkGreen, color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              Save Changes
            </button>
          </form>
        )}

        <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
           <button onClick={handleDeleteAccount} style={{ background: 'none', border: 'none', color: dangerRed, cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}>
             Delete Account Permanently
           </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;