import React, { useEffect, useState, useCallback } from 'react';
import API from '../api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [tab, setTab] = useState('users');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'patient' });
  const [selectedFile, setSelectedFile] = useState(null);

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchAllData = useCallback(async () => {
    try {
      const [uRes, aRes, rRes] = await Promise.all([
        API.get('/auth/all-users', config),
        API.get('/appointments/all', config),
        API.get('/reports/all', config)
      ]);
      setUsers(uRes.data || []);
      setAppointments(aRes.data || []);
      setReports(rRes.data || []);
    } catch (err) { console.error("Admin Fetch Error"); }
  }, [token]);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  const getShortId = (id) => id ? id.toString().slice(-5).toUpperCase() : "74563";

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', newUser, config);
      setShowAddModal(false);
      fetchAllData();
      alert("User Created!");
    } catch (err) { alert("Registration failed"); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete User Permanently?")) return;
    try {
      await API.delete(`/auth/user/${id}`, config);
      fetchAllData();
    } catch (err) { alert("Delete failed"); }
  };

  const handleDeleteAppt = async (id) => {
    if (!window.confirm("Remove this booking?")) return;
    try {
      await API.delete(`/appointments/cancel/${id}`, config);
      fetchAllData();
    } catch (err) { alert("Delete failed"); }
  };

  const handleUpload = async (userId) => {
    if (!selectedFile) return alert("Select File");
    const formData = new FormData();
    formData.append('report', selectedFile);
    formData.append('patientId', userId);
    formData.append('doctorName', 'Admin Office');
    try {
      await API.post('/reports/upload', formData, { 
        headers: { ...config.headers, 'Content-Type': 'multipart/form-data' } 
      });
      alert("Uploaded!");
      fetchAllData();
    } catch (err) { alert("Upload failed"); }
  };

  const th = { backgroundColor: '#f8f9fa', padding: '12px', textAlign: 'left', borderBottom: '2px solid #27ae60' };
  const td = { padding: '12px', borderBottom: '1px solid #eee' };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h1>System Administration</h1>
        <button onClick={() => setShowAddModal(true)} style={{ backgroundColor: '#27ae60', color: 'white', padding: '12px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>+ Add New User</button>
      </header>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setTab('users')} style={{ padding: '10px', background: tab === 'users' ? '#1b4332' : '#eee', color: tab === 'users' ? 'white' : '#000' }}>Users</button>
        <button onClick={() => setTab('appts')} style={{ padding: '10px', background: tab === 'appts' ? '#1b4332' : '#eee', color: tab === 'appts' ? 'white' : '#000' }}>Appointments</button>
      </div>

      {tab === 'users' ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={th}>Name</th><th style={th}>User ID</th><th style={th}>Role</th><th style={th}>Actions</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td style={td}>{u.name}</td><td style={td}>#{getShortId(u._id)}</td><td style={td}>{u.role}</td>
                <td style={td}><button onClick={() => handleDeleteUser(u._id)} style={{color:'red', border:'none', background:'none', cursor:'pointer'}}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={th}>Patient</th><th style={th}>Schedule</th><th style={th}>Prescription</th><th style={th}>Actions</th></tr></thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a._id}>
                <td style={td}>{a.userId?.name || 'Patient'}</td><td style={td}>{a.date} at {a.time}</td>
                <td style={td}>
                   <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} style={{width:'120px'}} />
                   <button onClick={() => handleUpload(a.userId?._id)} style={{fontSize:'10px'}}>Upload</button>
                </td>
                <td style={td}><button onClick={() => handleDeleteAppt(a._id)} style={{color:'red'}}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <form onSubmit={handleRegisterUser} style={{ background: 'white', padding: '30px', borderRadius: '10px' }}>
            <h3>Create User</h3>
            <input type="text" placeholder="Name" required style={{display:'block', marginBottom:'10px'}} onChange={e => setNewUser({...newUser, name: e.target.value})} />
            <input type="email" placeholder="Email" required style={{display:'block', marginBottom:'10px'}} onChange={e => setNewUser({...newUser, email: e.target.value})} />
            <input type="password" placeholder="Password" required style={{display:'block', marginBottom:'10px'}} onChange={e => setNewUser({...newUser, password: e.target.value})} />
            <select style={{display:'block', marginBottom:'20px'}} onChange={e => setNewUser({...newUser, role: e.target.value})}>
              <option value="patient">Patient</option><option value="doctor">Doctor</option><option value="admin">Admin</option>
            </select>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};
export default AdminDashboard;