import React, { useEffect, useState, useCallback } from 'react';
import API from '../api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [tab, setTab] = useState('users');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'patient' });

  const fetchClinicData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [userRes, appntRes] = await Promise.all([
        API.get('/auth/all-users', config),
        API.get('/appointments/all', config)
      ]);
      setUsers(userRes.data || []);
      setAllAppointments(appntRes.data || []);
    } catch (err) { console.error("Sync Error"); }
  }, []);

  useEffect(() => { fetchClinicData(); }, [fetchClinicData]);

  const getShortId = (longId) => {
    if(!longId) return "74563";
    let hash = 0;
    for (let i = 0; i < longId.length; i++) { hash = longId.charCodeAt(i) + ((hash << 5) - hash); }
    return Math.abs(hash % 90000) + 10000; 
  };

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', newUser);
      setShowAddModal(false);
      fetchClinicData();
      alert("User added!");
    } catch (err) { alert("Failed to add user"); }
  };

  const cellStyle = { padding: '15px', borderBottom: '1px solid #eee' };
  const headerStyle = { backgroundColor: '#f8f9fa', padding: '15px', textAlign: 'left', borderBottom: '2px solid #27ae60' };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Admin Control Center</h1>
        <button onClick={() => setShowAddModal(true)} style={{ backgroundColor: '#27ae60', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>+ Add User</button>
      </header>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <button onClick={() => setTab('users')} style={{ padding: '10px 20px', backgroundColor: tab === 'users' ? '#1b4332' : '#eee', color: tab === 'users' ? 'white' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Users ({users.length})</button>
        <button onClick={() => setTab('appointments')} style={{ padding: '10px 20px', backgroundColor: tab === 'appointments' ? '#1b4332' : '#eee', color: tab === 'appointments' ? 'white' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Master Schedule ({allAppointments.length})</button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {tab === 'users' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th style={headerStyle}>Name</th><th style={headerStyle}>User ID</th><th style={headerStyle}>Role</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}><td style={cellStyle}>{u.name}</td><td style={cellStyle}><code>#{getShortId(u._id)}</code></td><td style={cellStyle}>{u.role}</td></tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th style={headerStyle}>Patient</th><th style={headerStyle}>User ID</th><th style={headerStyle}>Service</th><th style={headerStyle}>Date</th><th style={headerStyle}>Status</th></tr>
            </thead>
            <tbody>
              {allAppointments.map(app => (
                <tr key={app._id}>
                  <td style={cellStyle}>{app.userId?.name || "Patient"}</td>
                  <td style={cellStyle}><code>#{getShortId(app.userId?._id)}</code></td>
                  <td style={cellStyle}>{app.service}</td>
                  <td style={cellStyle}>{app.date} at {app.time}</td>
                  <td style={cellStyle}><span style={{color: app.status === 'Cancelled' ? 'red' : '#27ae60', fontWeight: 'bold'}}>{app.status || 'Active'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleRegisterUser} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '350px' }}>
            <h3>New User</h3>
            <input type="text" placeholder="Name" required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} onChange={e => setNewUser({...newUser, name: e.target.value})} />
            <input type="email" placeholder="Email" required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} onChange={e => setNewUser({...newUser, email: e.target.value})} />
            <input type="password" placeholder="Password" required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} onChange={e => setNewUser({...newUser, password: e.target.value})} />
            <select style={{ width: '100%', marginBottom: '20px', padding: '8px' }} onChange={e => setNewUser({...newUser, role: e.target.value})}>
              <option value="patient">Patient</option><option value="doctor">Doctor</option><option value="admin">Admin</option>
            </select>
            <button type="submit" style={{ width: '100%', backgroundColor: '#27ae60', color: 'white', padding: '10px', border: 'none', borderRadius: '6px' }}>Save</button>
            <button type="button" onClick={() => setShowAddModal(false)} style={{ width: '100%', marginTop: '10px', background: 'none', border: 'none' }}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};
export default AdminDashboard;