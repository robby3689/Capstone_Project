import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '', email: '', phone: '', age: '', gender: '', password: ''
  });
  
  const userId = localStorage.getItem('userId');
  const primaryGreen = '#27ae60';
  const darkGreen = '#1b4332';

  useEffect(() => {
    setProfileData({
      ...profileData,
      name: localStorage.getItem('name') || '',
      email: localStorage.getItem('email') || '' 
    });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/auth/profile/${userId}`, profileData);
      localStorage.setItem('name', profileData.name);
      alert("Health profile updated successfully!");
    } catch (err) { alert("Update failed."); }
  };

  const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ddd' };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderTop: `6px solid ${primaryGreen}` }}>
        <h2 style={{ color: darkGreen, textAlign: 'center', marginBottom: '5px' }}>Patient Profile</h2>
        <p style={{ textAlign: 'center', color: primaryGreen, fontWeight: 'bold', marginBottom: '25px' }}>{profileData.email}</p>

        <form onSubmit={handleUpdate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label>Full Name</label>
              <input type="text" value={profileData.name} style={inputStyle} onChange={(e) => setProfileData({...profileData, name: e.target.value})} />
            </div>
            <div>
              <label>Phone Number</label>
              <input type="text" placeholder="e.g. +1 416-000-0000" style={inputStyle} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} />
            </div>
            <div>
              <label>Age</label>
              <input type="number" style={inputStyle} onChange={(e) => setProfileData({...profileData, age: e.target.value})} />
            </div>
            <div>
              <label>Gender</label>
              <select style={inputStyle} onChange={(e) => setProfileData({...profileData, gender: e.target.value})}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <label>Update Password</label>
          <input type="password" placeholder="Leave blank to keep current" style={inputStyle} onChange={(e) => setProfileData({...profileData, password: e.target.value})} />

          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: primaryGreen, color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            Save Patient Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;