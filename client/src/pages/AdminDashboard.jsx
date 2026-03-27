import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api';

const AdminDashboard = () => {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [tab, setTab] = useState(searchParams.get('tab') || 'users');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'patient' });

  const darkGreen = '#1b4332';
  const primaryGreen = '#27ae60';
  const dangerRed = '#e74c3c';

  // Function to fetch all data from backend
  const fetchClinicData = useCallback(async () => {
    try {
      // Fetching users and appointments in parallel for speed
      const [userRes, appntRes] = await Promise.all([
        API.get('/auth/all-users'),
        API.get('/appointments/all')
      ]);

      setUsers(Array.isArray(userRes.data) ? userRes.data : []);
      setAllAppointments(Array.isArray(appntRes.data) ? appntRes.data : []);
    } catch (err) {
      console.error("Data synchronization error:", err);
    }
  }, []);

  useEffect(() => {
    fetchClinicData();
  }, [fetchClinicData]);

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    try {
      // Backend expects lowercase roles via normalizeRole
      const payload = {
        ...newUser,
        role: newUser.role.toLowerCase().trim()
      };
      
      await API.post('/auth/register', payload);
      
      // Reset form and close modal
      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'patient' });
      
      // Refresh the list immediately from the database
      fetchClinicData();
      
      alert("Patient record successfully created.");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to register user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Permanently delete this user record?")) return;
    try {
      await API.delete(`/auth/user/${id}`);
      fetchClinicData();
    } catch (err) {
      alert("Delete operation failed");
    }
  };

  const filteredUsers = users.filter(u => 
    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Styles for a professional look
  const tableHeaderStyle = { backgroundColor: '#f8f9fa', color: darkGreen, padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' };
  const tableRowStyle = { padding: '15px', borderBottom: '1px solid #eee' };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', minHeight: '80vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ color: darkGreen, margin: 0 }}>Clinic Administration</h1>
          <p style={{ color: '#666', marginTop: '5px' }}>Managing patient database and clinic schedule</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)} 
          style={{ backgroundColor: primaryGreen, color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + Register New Patient
        </button>
      </header>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
        <button 
          onClick={() => setTab('users')} 
          style={{ padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', color: tab === 'users' ? primaryGreen : '#666', borderBottom: tab === 'users' ? `3px solid ${primaryGreen}` : 'none', fontWeight: 'bold' }}
        >
          Users ({users.length})
        </button>
        <button 
          onClick={() => setTab('appointments')} 
          style={{ padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', color: tab === 'appointments' ? primaryGreen : '#666', borderBottom: tab === 'appointments' ? `3px solid ${primaryGreen}` : 'none', fontWeight: 'bold' }}
        >
          Appointments ({allAppointments.length})
        </button>
        <input 
          type="text" 
          placeholder="Filter by name or email..." 
          style={{ marginLeft: 'auto', padding: '8px 15px', borderRadius: '20px', border: '1px solid #ccc', marginBottom: '10px', width: '250px' }} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {tab === 'users' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Full Identity</th>
                <th style={tableHeaderStyle}>Role</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? filteredUsers.map(user => (
                <tr key={user._id}>
                  <td style={tableRowStyle}>
                    <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{user.email}</div>
                  </td>
                  <td style={tableRowStyle}>
                    <span style={{ backgroundColor: '#f0f0f0', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold' }}>{user.role}</span>
                  </td>
                  <td style={tableRowStyle}>
                    <button onClick={() => handleDeleteUser(user._id)} style={{ color: dangerRed, border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="3" style={{ padding: '50px', textAlign: 'center', color: '#999' }}>No users found in database.</td></tr>
              )}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Patient</th>
                <th style={tableHeaderStyle}>Service Requested</th>
                <th style={tableHeaderStyle}>Scheduled Time</th>
              </tr>
            </thead>
            <tbody>
              {allAppointments.length > 0 ? allAppointments.map(app => (
                <tr key={app._id}>
                  <td style={tableRowStyle}>{app.userId?.name || app.userEmail || "Registered Patient"}</td>
                  <td style={tableRowStyle}>{app.service}</td>
                  <td style={tableRowStyle}>{app.date} at {app.time}</td>
                </tr>
              )) : (
                <tr><td colSpan="3" style={{ padding: '50px', textAlign: 'center', color: '#999' }}>No scheduled appointments.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleRegisterPatient} style={{ backgroundColor: 'white', padding: '40px', borderRadius: '15px', width: '400px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            <h2 style={{ marginTop: 0, color: darkGreen }}>New User Registration</h2>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Full Name</label>
              <input type="text" required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} onChange={e => setNewUser({...newUser, name: e.target.value})} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Email Address</label>
              <input type="email" required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} onChange={e => setNewUser({...newUser, email: e.target.value})} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Access Role</label>
              <select style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={{ marginBottom: '25px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Initial Password</label>
              <input type="password" required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} onChange={e => setNewUser({...newUser, password: e.target.value})} />
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button type="submit" style={{ flex: 1, padding: '14px', backgroundColor: primaryGreen, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Save Record</button>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '14px', backgroundColor: '#f1f1f1', color: '#444', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;