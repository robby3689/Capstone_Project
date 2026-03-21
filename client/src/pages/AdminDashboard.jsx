import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [tab, setTab] = useState('appointments'); 
  const [searchTerm, setSearchTerm] = useState('');

  const darkGreen = '#1b4332';
  const primaryGreen = '#27ae60';
  const dangerRed = '#e74c3c';

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const userRes = await axios.get('http://localhost:5000/api/auth/all-users');
      const appntRes = await axios.get('http://localhost:5000/api/appointments/all');
      setUsers(userRes.data);
      setAllAppointments(appntRes.data);
    } catch (err) {
      console.error("Admin data fetch failed.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Permanently remove this patient from the records?")) {
      try {
        await axios.delete(`http://localhost:5000/api/auth/user/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (err) { alert("Delete failed"); }
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statCardStyle = {
    flex: 1, backgroundColor: 'white', padding: '25px', borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: `6px solid ${primaryGreen}`, textAlign: 'center'
  };

  const tableHeaderStyle = { backgroundColor: '#f1f8f5', color: darkGreen, padding: '15px', textAlign: 'left', borderBottom: `2px solid ${primaryGreen}` };
  const cellStyle = { padding: '15px', borderBottom: '1px solid #eee' };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', minHeight: '80vh' }}>
      <h2 style={{ color: darkGreen, marginBottom: '5px' }}>Clinic Administration</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>Absolute access to Evergreen Clinic Highbury records.</p>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
        <div style={statCardStyle}>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Total Registered Patients</p>
          <h2 style={{ color: darkGreen, margin: '10px 0' }}>{users.length}</h2>
        </div>
        <div style={statCardStyle}>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Total Appointments</p>
          <h2 style={{ color: darkGreen, margin: '10px 0' }}>{allAppointments.length}</h2>
        </div>
        <div style={statCardStyle}>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Clinic Status</p>
          <h2 style={{ color: primaryGreen, margin: '10px 0' }}>Online</h2>
        </div>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button 
          onClick={() => setTab('appointments')} 
          style={{ padding: '12px 25px', cursor: 'pointer', borderRadius: '8px', border: 'none', backgroundColor: tab === 'appointments' ? primaryGreen : '#eee', color: tab === 'appointments' ? 'white' : '#444', fontWeight: 'bold' }}>
          Master Schedule
        </button>
        <button 
          onClick={() => setTab('users')} 
          style={{ padding: '12px 25px', cursor: 'pointer', borderRadius: '8px', border: 'none', backgroundColor: tab === 'users' ? primaryGreen : '#eee', color: tab === 'users' ? 'white' : '#444', fontWeight: 'bold' }}>
          Manage Patients
        </button>
        {tab === 'users' && (
          <input 
            type="text" 
            placeholder="Search patient..." 
            style={{ marginLeft: 'auto', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', width: '250px' }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {tab === 'appointments' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Patient ID</th>
                <th style={tableHeaderStyle}>Service</th>
                <th style={tableHeaderStyle}>Date</th>
                <th style={tableHeaderStyle}>Time</th>
              </tr>
            </thead>
            <tbody>
              {allAppointments.map(app => (
                <tr key={app._id}>
                  <td style={cellStyle}>{app.userId}</td>
                  <td style={cellStyle}>{app.service}</td>
                  <td style={cellStyle}>{app.date}</td>
                  <td style={{ ...cellStyle, color: primaryGreen, fontWeight: 'bold' }}>{app.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Full Name</th>
                <th style={tableHeaderStyle}>Email Address</th>
                <th style={tableHeaderStyle}>Account Role</th>
                <th style={tableHeaderStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td style={cellStyle}>{user.name}</td>
                  <td style={cellStyle}>{user.email}</td>
                  <td style={cellStyle}>
                     <span style={{ backgroundColor: user.role === 'Admin' ? '#f39c12' : '#eee', color: user.role === 'Admin' ? 'white' : '#444', padding: '4px 10px', borderRadius: '4px', fontSize: '12px' }}>
                        {user.role}
                     </span>
                  </td>
                  <td style={cellStyle}>
                    {user.role !== 'Admin' && (
                      <button onClick={() => handleDeleteUser(user._id)} style={{ color: dangerRed, border: `1px solid ${dangerRed}`, padding: '5px 10px', borderRadius: '4px', background: 'none', cursor: 'pointer' }}>
                        Delete
                      </button>
                    )}
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