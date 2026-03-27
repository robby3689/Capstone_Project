import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api';

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [tab, setTab] = useState(searchParams.get('tab') || 'users');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'patient' });

  const darkGreen = '#1b4332';
  const primaryGreen = '#27ae60';
  const dangerRed = '#e74c3c';

  // --- RE-FETCH LOGIC ---
  const fetchAdminData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // We add a random number to the URL to prevent the browser from showing "Old" data
      const nocache = Math.random();
      const [userRes, appntRes] = await Promise.all([
        API.get(`/auth/all-users?v=${nocache}`, config),
        API.get(`/appointments/all?v=${nocache}`, config)
      ]);

      setUsers(Array.isArray(userRes.data) ? userRes.data : []);
      setAllAppointments(Array.isArray(appntRes.data) ? appntRes.data : []);
    } catch (err) {
      console.error("Admin Data Fetch Failed");
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newUser,
        role: newUser.role.toLowerCase().trim()
      };
      
      await API.post('/auth/register', payload);
      alert("SUCCESS: New Patient Registered!");
      
      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'patient' });
      
      // Wait a tiny bit for the Database to settle, then refresh
      setTimeout(() => {
        fetchAdminData();
      }, 800);
      
    } catch (err) {
      alert(err.response?.data?.msg || "Error adding user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/auth/user/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAdminData();
    } catch (err) { alert("Delete failed"); }
  };

  // Logic to filter the users list (Showing EVERYTHING if no search term)
  const filteredUsers = (Array.isArray(users) ? users : []).filter(u => {
    const search = searchTerm.toLowerCase();
    return (u.name || '').toLowerCase().includes(search) || (u.email || '').toLowerCase().includes(search);
  });

  const tableHeaderStyle = { backgroundColor: '#f1f8f5', color: darkGreen, padding: '15px', textAlign: 'left', borderBottom: `2px solid ${primaryGreen}` };
  const cellStyle = { padding: '15px', borderBottom: '1px solid #eee' };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <div>
          <h2 style={{ color: darkGreen, margin: 0 }}>Clinic Administration</h2>
          <p style={{ color: '#666' }}>Managing {users.length} registered users</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchAdminData} style={{ backgroundColor: '#eee', border: '1px solid #ddd', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>🔄 Force Sync</button>
          <button onClick={() => setShowAddModal(true)} style={{ backgroundColor: primaryGreen, color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>+ Add New Patient</button>
        </div>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setTab('users')} style={{ padding: '10px 20px', backgroundColor: tab === 'users' ? darkGreen : '#eee', color: tab === 'users' ? 'white' : '#444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Patients & Staff</button>
        <button onClick={() => setTab('appointments')} style={{ padding: '10px 20px', backgroundColor: tab === 'appointments' ? darkGreen : '#eee', color: tab === 'appointments' ? 'white' : '#444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Live Appointments</button>
        <input type="text" placeholder="Search by name..." style={{ marginLeft: 'auto', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', width: '250px' }} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {tab === 'users' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>User Details</th>
                <th style={tableHeaderStyle}>Role</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? filteredUsers.map(user => (
                <tr key={user._id}>
                  <td style={cellStyle}>
                    <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{user.email}</div>
                  </td>
                  <td style={cellStyle}>
                    <span style={{ backgroundColor: '#eee', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold' }}>{user.role}</span>
                  </td>
                  <td style={cellStyle}>
                    <button onClick={() => handleDeleteUser(user._id)} style={{ color: dangerRed, border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Remove</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="3" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No users found in database.</td></tr>
              )}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Patient</th>
                <th style={tableHeaderStyle}>Service</th>
                <th style={tableHeaderStyle}>Schedule</th>
              </tr>
            </thead>
            <tbody>
              {allAppointments.map(app => (
                <tr key={app._id}>
                  <td style={cellStyle}>{app.userId?.name || app.userEmail || "Patient"}</td>
                  <td style={cellStyle}>{app.service}</td>
                  <td style={cellStyle}>{app.date} at {app.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleAddUser} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '380px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0, color: darkGreen }}>Register New Patient</h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Full Name</label>
              <input type="text" required style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }} onChange={e => setNewUser({...newUser, name: e.target.value})} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Email Address</label>
              <input type="email" required style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }} onChange={e => setNewUser({...newUser, email: e.target.value})} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Password</label>
              <input type="password" required style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }} onChange={e => setNewUser({...newUser, password: e.target.value})} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Assign Role</label>
              <select style={{ width: '100%', padding: '10px', marginTop: '5px' }} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: primaryGreen, color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Register</button>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '12px', backgroundColor: '#eee', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;