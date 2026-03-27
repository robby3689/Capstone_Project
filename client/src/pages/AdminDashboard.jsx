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

  useEffect(() => { 
    fetchAdminData(); 
  }, []);

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
    } catch (err) { 
      console.error("Fetch failed", err); 
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newUser,
        role: newUser.role.toLowerCase().trim()
      };
      
      await API.post('/auth/register', payload);
      alert("User added successfully!");
      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'patient' });
      await fetchAdminData(); 
    } catch (err) { 
      alert(err.response?.data?.msg || "Failed to add user"); 
    }
  };

  // --- NEW: FUNCTION TO DELETE A USER ---
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await API.delete(`/auth/user/${id}`, config);
      alert("User deleted");
      fetchAdminData();
    } catch (err) {
      alert("Error deleting user");
    }
  };

  // --- NEW: FUNCTION TO CANCEL AN APPOINTMENT ---
  const handleCancelAppointment = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await API.delete(`/appointments/cancel/${id}`, config);
      alert("Appointment cancelled");
      fetchAdminData();
    } catch (err) {
      alert("Error cancelling appointment");
    }
  };

  const filteredUsers = (Array.isArray(users) ? users : []).filter(u => {
    const nameMatch = (u.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || emailMatch;
  });

  const tableHeaderStyle = { backgroundColor: '#f1f8f5', color: darkGreen, padding: '15px', textAlign: 'left', borderBottom: `2px solid ${primaryGreen}` };
  const cellStyle = { padding: '15px', borderBottom: '1px solid #eee' };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Clinic Administration</h2>
        <button onClick={() => setShowAddModal(true)} style={{ backgroundColor: primaryGreen, color: 'white', padding: '12px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          + Add New User
        </button>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setTab('appointments')} style={{ padding: '10px 20px', backgroundColor: tab === 'appointments' ? darkGreen : '#eee', color: tab === 'appointments' ? 'white' : '#444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Appointments</button>
        <button onClick={() => setTab('users')} style={{ padding: '10px 20px', backgroundColor: tab === 'users' ? darkGreen : '#eee', color: tab === 'users' ? 'white' : '#444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Users</button>
        {tab === 'users' && (
           <input 
             type="text" 
             placeholder="Search name or email..." 
             style={{ marginLeft: 'auto', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} 
             onChange={(e) => setSearchTerm(e.target.value)} 
           />
        )}
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {tab === 'appointments' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Patient</th>
                <th style={tableHeaderStyle}>Service</th>
                <th style={tableHeaderStyle}>Date</th>
                <th style={tableHeaderStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {allAppointments.map(app => (
                <tr key={app._id}>
                  <td style={cellStyle}>{app.userId?.name || app.userEmail || "Patient"}</td>
                  <td style={cellStyle}>{app.service}</td>
                  <td style={cellStyle}>{app.date} at {app.time}</td>
                  <td style={cellStyle}>
                    <button onClick={() => handleCancelAppointment(app._id)} style={{ color: dangerRed, border: 'none', background: 'none', cursor: 'pointer' }}>Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Name</th>
                <th style={tableHeaderStyle}>Email</th>
                <th style={tableHeaderStyle}>Role</th>
                <th style={tableHeaderStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td style={cellStyle}>{user.name}</td>
                  <td style={cellStyle}>{user.email}</td>
                  <td style={cellStyle}>
                    <span style={{ backgroundColor: '#eee', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', textTransform: 'capitalize' }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={cellStyle}>
                    <button onClick={() => handleDeleteUser(user._id)} style={{ color: dangerRed, border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleAddUser} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px' }}>
            <h3 style={{ marginTop: 0 }}>Add New User</h3>
            <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Full Name</label>
            <input type="text" required style={{ width: '100%', marginBottom: '15px', padding: '10px', boxSizing: 'border-box' }} onChange={e => setNewUser({...newUser, name: e.target.value})} />
            
            <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Email Address</label>
            <input type="email" required style={{ width: '100%', marginBottom: '15px', padding: '10px', boxSizing: 'border-box' }} onChange={e => setNewUser({...newUser, email: e.target.value})} />
            
            <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Password</label>
            <input type="password" required style={{ width: '100%', marginBottom: '15px', padding: '10px', boxSizing: 'border-box' }} onChange={e => setNewUser({...newUser, password: e.target.value})} />
            
            <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Role</label>
            <select style={{ width: '100%', marginBottom: '20px', padding: '10px' }} value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: primaryGreen, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Save User</button>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '12px', backgroundColor: '#eee', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;