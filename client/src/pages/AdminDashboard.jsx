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
  const [selectedFile, setSelectedFile] = useState(null);

  const darkGreen = '#1b4332';
  const primaryGreen = '#27ae60';
  const dangerRed = '#e74c3c';

  // 1. DATA FETCHING (The Connection)
  // We use useCallback so we can call this function after adding a user or booking
  const fetchAllData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [userRes, appntRes] = await Promise.all([
        API.get('/auth/all-users', config),
        API.get('/appointments/all', config)
      ]);

      setUsers(Array.isArray(userRes.data) ? userRes.data : []);
      setAllAppointments(Array.isArray(appntRes.data) ? appntRes.data : []);
      console.log("Database Sync Complete");
    } catch (err) {
      console.error("Connection to Database failed", err);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // 2. ADD PATIENT LOGIC
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newUser, role: newUser.role.toLowerCase().trim() };
      await API.post('/auth/register', payload);
      
      alert("Success! Patient record created in Database.");
      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'patient' });
      
      // FORCE RE-FETCH: This makes the new user appear in the list immediately
      await fetchAllData(); 
    } catch (err) {
      alert(err.response?.data?.msg || "Error creating record");
    }
  };

  // 3. PRESCRIPTION LOGIC
  const handleUpload = async (patientId) => {
    if (!selectedFile) return alert("Select a PDF");
    const formData = new FormData();
    formData.append('report', selectedFile);
    formData.append('patientId', patientId);
    
    try {
      const token = localStorage.getItem('token');
      await API.post('/reports/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      alert("Prescription linked to Patient Profile");
      setSelectedFile(null);
    } catch (err) { alert("Upload failed"); }
  };

  // 4. FILTERING
  const filteredUsers = users.filter(u => 
    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableHeaderStyle = { backgroundColor: '#f1f8f5', color: darkGreen, padding: '12px', textAlign: 'left', borderBottom: `2px solid ${primaryGreen}` };
  const cellStyle = { padding: '12px', borderBottom: '1px solid #eee' };

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Clinic Control Center (Admin)</h2>
        <button onClick={() => setShowAddModal(true)} style={{ backgroundColor: primaryGreen, color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          + Register New Patient
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setTab('users')} style={{ padding: '10px 20px', backgroundColor: tab === 'users' ? darkGreen : '#eee', color: tab === 'users' ? 'white' : '#444', border: 'none', borderRadius: '5px' }}>Patients & Staff</button>
        <button onClick={() => setTab('appointments')} style={{ padding: '10px 20px', backgroundColor: tab === 'appointments' ? darkGreen : '#eee', color: tab === 'appointments' ? 'white' : '#444', border: 'none', borderRadius: '5px' }}>Live Appointments</button>
        <input type="text" placeholder="Search Database..." style={{ marginLeft: 'auto', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        {tab === 'users' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>User Identity</th>
                <th style={tableHeaderStyle}>Access Role</th>
                <th style={tableHeaderStyle}>Medical Reports</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td style={cellStyle}><strong>{user.name}</strong><br/><small>{user.email}</small></td>
                  <td style={cellStyle}><span style={{textTransform:'uppercase', fontSize:'11px', fontWeight:'bold'}}>{user.role}</span></td>
                  <td style={cellStyle}>
                    <input type="file" accept=".pdf" onChange={(e) => setSelectedFile(e.target.files[0])} style={{fontSize:'12px'}} />
                    <button onClick={() => handleUpload(user._id)} style={{backgroundColor:darkGreen, color:'white', border:'none', padding:'4px 8px', borderRadius:'4px', cursor:'pointer', marginLeft:'5px'}}>Upload PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Patient Name</th>
                <th style={tableHeaderStyle}>Medical Service</th>
                <th style={tableHeaderStyle}>Scheduled Time</th>
              </tr>
            </thead>
            <tbody>
              {allAppointments.map(app => (
                <tr key={app._id}>
                  <td style={cellStyle}>{app.userId?.name || app.userEmail || "Registered Patient"}</td>
                  <td style={cellStyle}>{app.service}</td>
                  <td style={cellStyle}>{app.date} @ {app.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for Adding Patient */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleAddUser} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '350px' }}>
            <h3>New Patient Registration</h3>
            <input type="text" placeholder="Full Name" required style={{ width: '100%', marginBottom: '10px', padding: '10px', boxSizing: 'border-box' }} onChange={e => setNewUser({...newUser, name: e.target.value})} />
            <input type="email" placeholder="Email Address" required style={{ width: '100%', marginBottom: '10px', padding: '10px', boxSizing: 'border-box' }} onChange={e => setNewUser({...newUser, email: e.target.value})} />
            <input type="password" placeholder="Temporary Password" required style={{ width: '100%', marginBottom: '10px', padding: '10px', boxSizing: 'border-box' }} onChange={e => setNewUser({...newUser, password: e.target.value})} />
            <select style={{ width: '100%', marginBottom: '20px', padding: '10px' }} onChange={e => setNewUser({...newUser, role: e.target.value})}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
            <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: primaryGreen, color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Register in System</button>
            <button type="button" onClick={() => setShowAddModal(false)} style={{ width: '100%', marginTop: '10px', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;