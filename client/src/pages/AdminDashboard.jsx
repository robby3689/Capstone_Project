import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api';

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [tab, setTab] = useState(searchParams.get('tab') || 'appointments');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'patient' });

  const darkGreen = '#1b4332';
  const primaryGreen = '#27ae60';
  const dangerRed = '#e74c3c';

  useEffect(() => { fetchAdminData(); }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [userRes, appntRes] = await Promise.all([
        API.get('/auth/all-users', config),
        API.get('/appointments/all', config)
      ]);
      setUsers(Array.isArray(userRes.data) ? userRes.data : []);
      setAllAppointments(Array.isArray(appntRes.data) ? appntRes.data : []);
    } catch (err) { console.error("Fetch failed"); }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', newUser);
      alert("User added!");
      setShowAddModal(false);
      fetchAdminData();
    } catch (err) { alert("Failed to add user"); }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Delete user?")) {
      try {
        await API.delete(`/auth/user/${id}`);
        fetchAdminData();
      } catch (err) { alert("Delete failed"); }
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableHeaderStyle = { backgroundColor: '#f1f8f5', color: darkGreen, padding: '15px', textAlign: 'left' };
  const cellStyle = { padding: '15px', borderBottom: '1px solid #eee' };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Clinic Administration</h2>
        <button onClick={() => setShowAddModal(true)} style={{ backgroundColor: primaryGreen, color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>+ Add User</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setTab('appointments')} style={{ marginRight: '10px', padding: '10px', backgroundColor: tab === 'appointments' ? darkGreen : '#eee', color: tab === 'appointments' ? 'white' : '#000' }}>Appointments</button>
        <button onClick={() => setTab('users')} style={{ padding: '10px', backgroundColor: tab === 'users' ? darkGreen : '#eee', color: tab === 'users' ? 'white' : '#000' }}>Users</button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        {tab === 'appointments' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={tableHeaderStyle}>Patient</th><th style={tableHeaderStyle}>Service</th><th style={tableHeaderStyle}>Date</th><th style={tableHeaderStyle}>Action</th></tr></thead>
            <tbody>
              {allAppointments.map(app => (
                <tr key={app._id}>
                  <td style={cellStyle}>{app.userId?.name || app.userEmail || "Patient"}</td>
                  <td style={cellStyle}>{app.service}</td>
                  <td style={cellStyle}>{app.date} at {app.time}</td>
                  <td style={cellStyle}><button onClick={() => handleDeleteUser(app._id)} style={{ color: dangerRed, border: 'none', background: 'none' }}>Cancel</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={tableHeaderStyle}>Name</th><th style={tableHeaderStyle}>Email</th><th style={tableHeaderStyle}>Role</th><th style={tableHeaderStyle}>Action</th></tr></thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td style={cellStyle}>{user.name}</td>
                  <td style={cellStyle}>{user.email}</td>
                  <td style={cellStyle}>{user.role}</td>
                  <td style={cellStyle}><button onClick={() => handleDeleteUser(user._id)} style={{ color: dangerRed, border: 'none', background: 'none' }}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <form onSubmit={handleAddUser} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px' }}>
            <h3>Add New User</h3>
            <input type="text" placeholder="Name" required style={{ width: '100%', marginBottom: '10px', padding: '10px' }} onChange={e => setNewUser({...newUser, name: e.target.value})} />
            <input type="email" placeholder="Email" required style={{ width: '100%', marginBottom: '10px', padding: '10px' }} onChange={e => setNewUser({...newUser, email: e.target.value})} />
            <input type="password" placeholder="Password" required style={{ width: '100%', marginBottom: '10px', padding: '10px' }} onChange={e => setNewUser({...newUser, password: e.target.value})} />
            <select style={{ width: '100%', marginBottom: '20px', padding: '10px' }} onChange={e => setNewUser({...newUser, role: e.target.value})}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: primaryGreen, color: 'white', border: 'none' }}>Save</button>
            <button type="button" onClick={() => setShowAddModal(false)} style={{ width: '100%', marginTop: '10px', background: 'none', border: 'none' }}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;