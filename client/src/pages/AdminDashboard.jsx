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
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [userRes, appntRes] = await Promise.all([
        API.get('/auth/all-users', config),
        API.get('/appointments/all', config)
      ]);
      setUsers(Array.isArray(userRes.data) ? userRes.data : []);
      setAllAppointments(Array.isArray(appntRes.data) ? appntRes.data : []);
    } catch (err) { console.error("Sync Error:", err); }
  }, []);

  useEffect(() => { fetchClinicData(); }, [fetchClinicData]);

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newUser, role: newUser.role.toLowerCase().trim() };
      await API.post('/auth/register', payload);
      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'patient' });
      await fetchClinicData();
      alert("User registered successfully!");
    } catch (err) { alert(err.response?.data?.msg || "Registration failed"); }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm("Cancel this appointment? It will remain in records as 'Cancelled'.")) return;
    try {
      const token = localStorage.getItem('token');
      // Using PUT to update status so the record stays visible but marked as red
      await API.put(`/appointments/status/${id}`, { status: 'Cancelled' }, { headers: { Authorization: `Bearer ${token}` } });
      fetchClinicData();
    } catch (err) { alert("Cancellation failed"); }
  };

  const filteredUsers = users.filter(u => 
    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u._id || '').includes(searchTerm)
  );

  const tableHeaderStyle = { backgroundColor: '#f8f9fa', color: darkGreen, padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' };
  const cellStyle = { padding: '15px', borderBottom: '1px solid #eee' };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', minHeight: '80vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: darkGreen }}>Clinic Administration</h1>
        <button onClick={() => setShowAddModal(true)} style={{ backgroundColor: primaryGreen, color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>+ Add New User</button>
      </header>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
        <button onClick={() => setTab('users')} style={{ padding: '10px 20px', backgroundColor: tab === 'users' ? darkGreen : '#eee', color: tab === 'users' ? 'white' : '#333', border: 'none', borderRadius: '6px' }}>Users ({users.length})</button>
        <button onClick={() => setTab('appointments')} style={{ padding: '10px 20px', backgroundColor: tab === 'appointments' ? darkGreen : '#eee', color: tab === 'appointments' ? 'white' : '#333', border: 'none', borderRadius: '6px' }}>Master Schedule ({allAppointments.length})</button>
        <input type="text" placeholder="Search Name or User ID..." style={{ marginLeft: 'auto', padding: '10px', width: '250px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {tab === 'users' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th style={tableHeaderStyle}>User Details</th><th style={tableHeaderStyle}>User ID</th><th style={tableHeaderStyle}>Role</th></tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td style={cellStyle}><strong>{user.name}</strong><br/><small>{user.email}</small></td>
                  <td style={cellStyle}><code>{user._id}</code></td>
                  <td style={cellStyle}><span style={{textTransform:'uppercase', fontWeight:'bold', fontSize:'11px'}}>{user.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th style={tableHeaderStyle}>Patient</th><th style={tableHeaderStyle}>User ID</th><th style={tableHeaderStyle}>Service</th><th style={tableHeaderStyle}>Status</th><th style={tableHeaderStyle}>Action</th></tr>
            </thead>
            <tbody>
              {allAppointments.map(app => (
                <tr key={app._id}>
                  <td style={cellStyle}>{app.userId?.name || 'Guest'}</td>
                  <td style={cellStyle}><code>{app.userId?._id || 'N/A'}</code></td>
                  <td style={cellStyle}>{app.service}</td>
                  <td style={cellStyle}><span style={{color: app.status === 'Cancelled' ? dangerRed : primaryGreen, fontWeight: 'bold'}}>{app.status || 'Active'}</span></td>
                  <td style={cellStyle}>
                    {app.status !== 'Cancelled' && <button onClick={() => handleCancelAppointment(app._id)} style={{ color: dangerRed, border: 'none', background: 'none', cursor: 'pointer' }}>Cancel</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleRegisterUser} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '350px' }}>
            <h3>Create New User Profile</h3>
            <input type="text" placeholder="Name" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} onChange={e => setNewUser({...newUser, name: e.target.value})} />
            <input type="email" placeholder="Email" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} onChange={e => setNewUser({...newUser, email: e.target.value})} />
            <input type="password" placeholder="Password" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} onChange={e => setNewUser({...newUser, password: e.target.value})} />
            <select style={{ width: '100%', padding: '10px', marginBottom: '20px' }} onChange={e => setNewUser({...newUser, role: e.target.value})}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: primaryGreen, color: 'white', border: 'none', borderRadius: '6px' }}>Save User</button>
            <button type="button" onClick={() => setShowAddModal(false)} style={{ width: '100%', marginTop: '10px', background: 'none', border: 'none' }}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};
export default AdminDashboard;