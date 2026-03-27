import React, { useEffect, useState, useCallback } from 'react';
import API from '../api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [tab, setTab] = useState('users');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'patient' });

  // 1. Force a Fresh Fetch from the Server
  const fetchAllData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // We add a timestamp to the URL to prevent browser caching
      const timestamp = new Date().getTime();
      const [userRes, appntRes] = await Promise.all([
        API.get(`/auth/all-users?t=${timestamp}`, config),
        API.get(`/appointments/all?t=${timestamp}`, config)
      ]);

      console.log("RAW USERS FROM SERVER:", userRes.data);
      setUsers(userRes.data || []);
      setAllAppointments(appntRes.data || []);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      // We force 'patient' role here to ensure it matches your DB schema
      const payload = { ...newUser, role: 'patient' };
      const res = await API.post('/auth/register', payload);
      
      console.log("SERVER RESPONSE AFTER ADD:", res.data);
      alert("SUCCESS: Patient added to Database!");
      
      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'patient' });
      
      // WAIT 1 SECOND THEN REFETCH (gives the DB time to index)
      setTimeout(() => {
        fetchAllData();
      }, 1000);

    } catch (err) {
      alert(err.response?.data?.msg || "Error adding user");
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Admin Management Portal</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          style={{ padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          + Register New Patient
        </button>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
        <button onClick={() => setTab('users')} style={{ fontWeight: tab === 'users' ? 'bold' : 'normal' }}>All Users ({users.length})</button>
        <button onClick={() => setTab('appointments')} style={{ fontWeight: tab === 'appointments' ? 'bold' : 'normal' }}>All Appointments ({allAppointments.length})</button>
      </div>

      <div style={{ marginTop: '20px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px' }}>
        {tab === 'users' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{user.name}</td>
                  <td style={{ padding: '12px' }}>{user.email}</td>
                  <td style={{ padding: '12px' }}>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Patient Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Service</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {allAppointments.map((app) => (
                <tr key={app._id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{app.userId?.name || app.userEmail || "Patient"}</td>
                  <td style={{ padding: '12px' }}>{app.service}</td>
                  <td style={{ padding: '12px' }}>{app.date} @ {app.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <form onSubmit={handleAddUser} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '300px' }}>
            <h3>Add Patient</h3>
            <input type="text" placeholder="Name" required style={{ width: '100%', marginBottom: '10px' }} onChange={e => setNewUser({...newUser, name: e.target.value})} />
            <input type="email" placeholder="Email" required style={{ width: '100%', marginBottom: '10px' }} onChange={e => setNewUser({...newUser, email: e.target.value})} />
            <input type="password" placeholder="Password" required style={{ width: '100%', marginBottom: '20px' }} onChange={e => setNewUser({...newUser, password: e.target.value})} />
            <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#27ae60', color: 'white', border: 'none' }}>Save to Database</button>
            <button type="button" onClick={() => setShowAddModal(false)} style={{ width: '100%', marginTop: '10px' }}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;