import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [tab, setTab] = useState('appointments'); 
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'Patient' });

  const darkGreen = '#1b4332';
  const primaryGreen = '#27ae60';
  const dangerRed = '#e74c3c';
  const warningOrange = '#f39c12';

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const userRes = await axios.get('http://localhost:5000/api/auth/all-users', config);
      const appntRes = await axios.get('http://localhost:5000/api/appointments/all', config);
      
      setUsers(userRes.data);
      setAllAppointments(appntRes.data);
    } catch (err) {
      console.error("Admin data fetch failed.");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', newUser);
      alert("User created successfully!");
      setShowAddModal(false);
      fetchAdminData();
    } catch (err) { alert("Failed to add user"); }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Permanently remove this patient from the records?")) {
      try {
        await axios.delete(`http://localhost:5000/api/auth/user/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (err) { alert("Delete failed"); }
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (window.confirm("Cancel and delete this appointment?")) {
      try {
        await axios.delete(`http://localhost:5000/api/appointments/${id}`);
        setAllAppointments(allAppointments.filter(a => a._id !== id));
      } catch (err) { alert("Failed to delete appointment"); }
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableHeaderStyle = { backgroundColor: '#f1f8f5', color: darkGreen, padding: '15px', textAlign: 'left', borderBottom: `2px solid ${primaryGreen}` };
  const cellStyle = { padding: '15px', borderBottom: '1px solid #eee' };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: darkGreen, marginBottom: '5px' }}>Clinic Administration</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>Management Hub for Evergreen Clinic Highbury.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          style={{ backgroundColor: primaryGreen, color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          + Add New User
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
        <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: `6px solid ${primaryGreen}` }}>
          <p style={{ color: '#666', margin: 0 }}>Total Patients</p>
          <h2 style={{ color: darkGreen }}>{users.length}</h2>
        </div>
        <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: `6px solid ${warningOrange}` }}>
          <p style={{ color: '#666', margin: 0 }}>Active Appointments</p>
          <h2 style={{ color: darkGreen }}>{allAppointments.length}</h2>
        </div>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setTab('appointments')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: tab === 'appointments' ? darkGreen : '#eee', color: tab === 'appointments' ? 'white' : '#444', cursor: 'pointer' }}>Master Schedule</button>
        <button onClick={() => setTab('users')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: tab === 'users' ? darkGreen : '#eee', color: tab === 'users' ? 'white' : '#444', cursor: 'pointer' }}>User Management</button>
        {tab === 'users' && <input type="text" placeholder="Search by name or email..." style={{ marginLeft: 'auto', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', width: '250px' }} onChange={(e) => setSearchTerm(e.target.value)} />}
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {tab === 'appointments' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Patient Email</th>
                <th style={tableHeaderStyle}>Service</th>
                <th style={tableHeaderStyle}>Date/Time</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allAppointments.map(app => (
                <tr key={app._id}>
                  <td style={cellStyle}>{app.userEmail || app.userId}</td>
                  <td style={cellStyle}>{app.service}</td>
                  <td style={cellStyle}>{app.date} at {app.time}</td>
                  <td style={cellStyle}>
                    <button onClick={() => handleDeleteAppointment(app._id)} style={{ color: dangerRed, border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                  </td>
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
                <th style={tableHeaderStyle}>Role</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td style={cellStyle}>{user.name}</td>
                  <td style={cellStyle}>{user.email}</td>
                  <td style={cellStyle}><span style={{ backgroundColor: user.role === 'Admin' ? warningOrange : '#eee', color: user.role === 'Admin' ? 'white' : '#444', padding: '4px 10px', borderRadius: '4px', fontSize: '12px' }}>{user.role}</span></td>
                  <td style={cellStyle}>
                    {user.role !== 'Admin' && (
                      <>
                        <button style={{ color: primaryGreen, border: 'none', background: 'none', cursor: 'pointer', marginRight: '10px' }}>Edit</button>
                        <button onClick={() => handleDeleteUser(user._id)} style={{ color: dangerRed, border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <form onSubmit={handleAddUser} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px' }}>
            <h3>Add New User</h3>
            <input type="text" placeholder="Full Name" required style={{ width: '100%', padding: '10px', margin: '10px 0' }} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
            <input type="email" placeholder="Email" required style={{ width: '100%', padding: '10px', margin: '10px 0' }} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
            <input type="password" placeholder="Password" required style={{ width: '100%', padding: '10px', margin: '10px 0' }} onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
            <select style={{ width: '100%', padding: '10px', margin: '10px 0' }} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
              <option value="Admin">Admin</option>
            </select>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: primaryGreen, color: 'white', border: 'none', borderRadius: '6px' }}>Save User</button>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '10px', backgroundColor: '#eee', border: 'none', borderRadius: '6px' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;