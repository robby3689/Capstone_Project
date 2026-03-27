import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api';

const AdminDashboard = () => {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [tab, setTab] = useState(searchParams.get('tab') || 'users');
  const [searchTerm, setSearchTerm] = useState('');

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

  // HELPER: Generate a 5-digit number based on the MongoID string
  const getShortId = (longId) => {
     if(!longId) return "74563"; // Fallback
     let hash = 0;
     for (let i = 0; i < longId.length; i++) {
        hash = longId.charCodeAt(i) + ((hash << 5) - hash);
     }
     return Math.abs(hash % 90000) + 10000; 
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      const token = localStorage.getItem('token');
      await API.put(`/appointments/status/${id}`, { status: 'Cancelled' }, { headers: { Authorization: `Bearer ${token}` } });
      fetchClinicData();
    } catch (err) { alert("Cancellation failed"); }
  };

  const tableHeaderStyle = { backgroundColor: '#f8f9fa', color: darkGreen, padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' };
  const cellStyle = { padding: '15px', borderBottom: '1px solid #eee' };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ color: darkGreen }}>Clinic Master Schedule</h1>
      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
        <button onClick={() => setTab('users')} style={{ padding: '10px 20px', backgroundColor: tab === 'users' ? darkGreen : '#eee', color: tab === 'users' ? 'white' : '#333', border: 'none', borderRadius: '6px' }}>Users ({users.length})</button>
        <button onClick={() => setTab('appointments')} style={{ padding: '10px 20px', backgroundColor: tab === 'appointments' ? darkGreen : '#eee', color: tab === 'appointments' ? 'white' : '#333', border: 'none', borderRadius: '6px' }}>Appointments ({allAppointments.length})</button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {tab === 'users' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th style={tableHeaderStyle}>Name</th><th style={tableHeaderStyle}>User ID</th><th style={tableHeaderStyle}>Role</th></tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td style={cellStyle}><strong>{user.name}</strong><br/><small>{user.email}</small></td>
                  <td style={cellStyle}><code>#{getShortId(user._id)}</code></td>
                  <td style={cellStyle}><span style={{textTransform:'uppercase', fontWeight:'bold', fontSize:'11px'}}>{user.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th style={tableHeaderStyle}>Patient Name</th><th style={tableHeaderStyle}>User ID</th><th style={tableHeaderStyle}>Schedule</th><th style={tableHeaderStyle}>Status</th><th style={tableHeaderStyle}>Action</th></tr>
            </thead>
            <tbody>
              {allAppointments.map(app => (
                <tr key={app._id}>
                  <td style={cellStyle}>{app.userId?.name || "Patient"}</td>
                  <td style={cellStyle}><code>#{getShortId(app.userId?._id)}</code></td>
                  <td style={cellStyle}>{app.date} at {app.time}</td>
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
    </div>
  );
};
export default AdminDashboard;