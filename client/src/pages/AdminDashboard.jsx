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

  const fetchClinicData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      // Adding headers explicitly to ensure Authorization is sent
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      console.log("Fetching from: /auth/all-users");
      const userRes = await API.get('/auth/all-users', config);
      const appntRes = await API.get('/appointments/all', config);

      setUsers(Array.isArray(userRes.data) ? userRes.data : []);
      setAllAppointments(Array.isArray(appntRes.data) ? appntRes.data : []);
    } catch (err) {
      console.error("Fetch Error:", err.response?.status, err.message);
    }
  }, []);

  useEffect(() => {
    fetchClinicData();
  }, [fetchClinicData]);

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newUser, role: newUser.role.toLowerCase().trim() };
      await API.post('/auth/register', payload);
      
      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'patient' });
      
      // Immediate refresh
      fetchClinicData();
      alert("Patient registered successfully!");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await API.delete(`/auth/user/${id}`);
      fetchClinicData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filteredUsers = users.filter(u => 
    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', minHeight: '80vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ color: darkGreen, margin: 0 }}>Clinic Administration</h1>
          <p style={{ color: '#666' }}>Managing patient database and clinic schedule</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)} 
          style={{ backgroundColor: primaryGreen, color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + Register New Patient
        </button>
      </header>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
        <button onClick={() => setTab('users')} style={{ padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', color: tab === 'users' ? primaryGreen : '#666', borderBottom: tab === 'users' ? `3px solid ${primaryGreen}` : 'none', fontWeight: 'bold' }}>
          Users ({users.length})
        </button>
        <button onClick={() => setTab('appointments')} style={{ padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', color: tab === 'appointments' ? primaryGreen : '#666', borderBottom: tab === 'appointments' ? `3px solid ${primaryGreen}` : 'none', fontWeight: 'bold' }}>
          Appointments ({allAppointments.length})
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {tab === 'users' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>User Details</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? filteredUsers.map(user => (
                <tr key={user._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px' }}>
                    <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{user.email}</div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ backgroundColor: '#f0f0f0', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold' }}>{user.role}</span>
                  </td>
                  <td style={{ padding: '15px' }}>
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
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>Patient</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Service</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Scheduled Time</th>
              </tr>
            </thead>
            <tbody>
              {allAppointments.map(app => (
                <tr key={app._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px' }}>{app.userId?.name || app.userEmail || "Patient"}</td>
                  <td style={{ padding: '15px' }}>{app.service}</td>
                  <td style={{ padding: '15px' }}>{app.date} at {app.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleRegisterPatient} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '350px' }}>
            <h3 style={{ marginTop: 0 }}>Register New User</h3>
            <input type="text" placeholder="Full Name" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} onChange={e => setNewUser({...newUser, name: e.target.value})} />
            <input type="email" placeholder="Email Address" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} onChange={e => setNewUser({...newUser, email: e.target.value})} />
            <input type="password" placeholder="Password" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} onChange={e => setNewUser({...newUser, password: e.target.value})} />
            <select style={{ width: '100%', padding: '10px', marginBottom: '20px' }} onChange={e => setNewUser({...newUser, role: e.target.value})}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: primaryGreen, color: 'white', border: 'none', borderRadius: '6px' }}>Save</button>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '10px', backgroundColor: '#eee', border: 'none', borderRadius: '6px' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;