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

  const getShortId = (id) => id ? id.toString().slice(-5).toUpperCase() : "00000";

  // --- CONTROLS ---
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await API.delete(`/auth/user/${id}`, config);
      fetchAllData();
    } catch (err) { alert("Delete failed"); }
  };

  const handleCancelAppt = async (id) => {
    try {
      await API.put(`/appointments/status/${id}`, { status: 'Cancelled' }, config);
      fetchAllData();
    } catch (err) { alert("Cancel failed"); }
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm("Delete this prescription?")) return;
    try {
      await API.delete(`/reports/${id}`, config);
      fetchAllData();
    } catch (err) { alert("Prescription delete failed"); }
  };

  const handleUpload = async (userId) => {
    if (!selectedFile) return alert("Select PDF");
    const formData = new FormData();
    formData.append('report', selectedFile);
    formData.append('patientId', userId);
    formData.append('doctorName', 'Admin Office');
    try {
      await API.post('/reports/upload', formData, { 
        headers: { ...config.headers, 'Content-Type': 'multipart/form-data' } 
      });
      alert("Prescription Uploaded!");
      fetchAllData();
    } catch (err) { alert("Upload failed"); }
  };

  const headerStyle = { backgroundColor: '#f8f9fa', padding: '12px', textAlign: 'left', borderBottom: '2px solid #27ae60' };
  const cellStyle = { padding: '12px', borderBottom: '1px solid #eee' };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h1>Admin Control Center (Full Access)</h1>
        <button onClick={() => setShowAddModal(true)} style={{ backgroundColor: '#27ae60', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>+ Add User</button>
      </header>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setTab('users')} style={{ padding: '10px 20px', background: tab === 'users' ? '#1b4332' : '#eee', color: tab === 'users' ? 'white' : '#000', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Users</button>
        <button onClick={() => setTab('appts')} style={{ padding: '10px 20px', background: tab === 'appts' ? '#1b4332' : '#eee', color: tab === 'appts' ? 'white' : '#000', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Appointments</button>
        <button onClick={() => setTab('reports')} style={{ padding: '10px 20px', background: tab === 'reports' ? '#1b4332' : '#eee', color: tab === 'reports' ? 'white' : '#000', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Prescriptions</button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {tab === 'users' && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={headerStyle}>Name</th><th style={headerStyle}>ID</th><th style={headerStyle}>Role</th><th style={headerStyle}>Action</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}><td style={cellStyle}>{u.name}</td><td style={cellStyle}>#{getShortId(u._id)}</td><td style={cellStyle}>{u.role}</td>
                  <td style={cellStyle}><button onClick={() => handleDeleteUser(u._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Delete User</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'appts' && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={headerStyle}>Patient</th><th style={headerStyle}>User ID</th><th style={headerStyle}>Date/Time</th><th style={headerStyle}>Status</th><th style={headerStyle}>Prescription</th><th style={headerStyle}>Action</th></tr></thead>
            <tbody>
              {appointments.map(a => (
                <tr key={a._id}>
                  <td style={cellStyle}>{a.userId?.name || 'Patient'}</td>
                  <td style={cellStyle}>#{getShortId(a.userId?._id)}</td>
                  <td style={cellStyle}>{a.date} | {a.time}</td>
                  <td style={cellStyle}>{a.status || 'Active'}</td>
                  <td style={cellStyle}>
                    <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} style={{width:'150px'}} />
                    <button onClick={() => handleUpload(a.userId?._id)} style={{fontSize:'10px'}}>Upload</button>
                  </td>
                  <td style={cellStyle}><button onClick={() => handleCancelAppt(a._id)} style={{color:'orange'}}>Cancel</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'reports' && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={headerStyle}>File Name</th><th style={headerStyle}>Patient ID</th><th style={headerStyle}>Action</th></tr></thead>
            <tbody>
              {reports.map(r => (
                <tr key={r._id}><td style={cellStyle}>{r.fileName}</td><td style={cellStyle}>#{getShortId(r.patientId)}</td>
                  <td style={cellStyle}><button onClick={() => handleDeleteReport(r._id)} style={{color:'red'}}>Delete File</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '10px' }}>
            <h3>Register User</h3>
            <input type="text" placeholder="Name" style={{display:'block', marginBottom:'10px'}} onChange={e => setNewUser({...newUser, name: e.target.value})} />
            <input type="email" placeholder="Email" style={{display:'block', marginBottom:'10px'}} onChange={e => setNewUser({...newUser, email: e.target.value})} />
            <input type="password" placeholder="Password" style={{display:'block', marginBottom:'10px'}} onChange={e => setNewUser({...newUser, password: e.target.value})} />
            <select onChange={e => setNewUser({...newUser, role: e.target.value})} style={{display:'block', marginBottom:'10px'}}>
              <option value="patient">Patient</option><option value="doctor">Doctor</option><option value="admin">Admin</option>
            </select>
            <button onClick={handleRegisterUser}>Save</button>
            <button onClick={() => setShowAddModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminDashboard;