import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api';

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [tab, setTab] = useState(searchParams.get('tab') || 'users'); // Default to users to see changes
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'patient' });

  // Prescription Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingForId, setUploadingForId] = useState(null);

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

      // Important: Ensure we are getting an array
      setUsers(Array.isArray(userRes.data) ? userRes.data : []);
      setAllAppointments(Array.isArray(appntRes.data) ? appntRes.data : []);
    } catch (err) { 
      console.error("Fetch failed", err); 
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      // Force lowercase to ensure visibility in filters
      const payload = {
        ...newUser,
        role: newUser.role.toLowerCase().trim()
      };
      
      await API.post('/auth/register', payload);
      alert("New Patient added successfully!");
      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'patient' });
      
      // RE-FETCH IMMEDIATELY
      await fetchAdminData(); 
    } catch (err) { 
      alert(err.response?.data?.msg || "Failed to add user"); 
    }
  };

  const handleUploadPrescription = async (patientId) => {
    if (!selectedFile) return alert("Please select a PDF file first.");
    
    const formData = new FormData();
    formData.append('report', selectedFile);
    formData.append('patientId', patientId);
    formData.append('doctorName', 'Evergreen Admin');

    try {
      const token = localStorage.getItem('token');
      await API.post('/reports/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      alert("Prescription uploaded successfully!");
      setSelectedFile(null);
      setUploadingForId(null);
    } catch (err) {
      alert("Upload failed. Check backend logs.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/auth/user/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAdminData();
    } catch (err) { alert("Delete failed"); }
  };

  // Logic to filter the users list
  const filteredUsers = (Array.isArray(users) ? users : []).filter(u => {
    const search = searchTerm.toLowerCase();
    return (u.name || '').toLowerCase().includes(search) || (u.email || '').toLowerCase().includes(search);
  });

  const tableHeaderStyle = { backgroundColor: '#f1f8f5', color: darkGreen, padding: '15px', textAlign: 'left' };
  const cellStyle = { padding: '15px', borderBottom: '1px solid #eee' };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Evergreen Administration</h2>
        <button onClick={() => setShowAddModal(true)} style={{ backgroundColor: primaryGreen, color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          + Add New Patient
        </button>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setTab('users')} style={{ padding: '10px 20px', backgroundColor: tab === 'users' ? darkGreen : '#eee', color: tab === 'users' ? 'white' : '#444', border: 'none', borderRadius: '6px' }}>User Management</button>
        <button onClick={() => setTab('appointments')} style={{ padding: '10px 20px', backgroundColor: tab === 'appointments' ? darkGreen : '#eee', color: tab === 'appointments' ? 'white' : '#444', border: 'none', borderRadius: '6px' }}>Master Schedule</button>
        <input type="text" placeholder="Search patients..." style={{ marginLeft: 'auto', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {tab === 'users' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Name & Email</th>
                <th style={tableHeaderStyle}>Role</th>
                <th style={tableHeaderStyle}>Prescription</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td style={cellStyle}>
                    <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{user.email}</div>
                  </td>
                  <td style={cellStyle}>
                    <span style={{ backgroundColor: '#eee', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', textTransform: 'capitalize' }}>{user.role}</span>
                  </td>
                  <td style={cellStyle}>
                    {/* Prescription Upload UI */}
                    <input type="file" accept=".pdf" onChange={(e) => setSelectedFile(e.target.files[0])} style={{ fontSize: '12px', width: '150px' }} />
                    <button 
                      onClick={() => handleUploadPrescription(user._id)}
                      style={{ backgroundColor: darkGreen, color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginLeft: '5px' }}
                    >
                      Upload
                    </button>
                  </td>
                  <td style={cellStyle}>
                    <button onClick={() => handleDeleteUser(user._id)} style={{ color: dangerRed, border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Patient</th>
                <th style={tableHeaderStyle}>Service</th>
                <th style={tableHeaderStyle}>Date</th>
              </tr>
            </thead>
            <tbody>
              {allAppointments.map(app => (
                <tr key={app._id}>
                  <td style={cellStyle}>{app.userId?.name || "No Name"}</td>
                  <td style={cellStyle}>{app.service}</td>
                  <td style={cellStyle}>{app.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleAddUser} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px' }}>
            <h3 style={{ marginTop: 0 }}>Create New Record</h3>
            <input type="text" placeholder="Full Name" required style={{ width: '100%', marginBottom: '15px', padding: '10px' }} onChange={e => setNewUser({...newUser, name: e.target.value})} />
            <input type="email" placeholder="Email" required style={{ width: '100%', marginBottom: '15px', padding: '10px' }} onChange={e => setNewUser({...newUser, email: e.target.value})} />
            <input type="password" placeholder="Password" required style={{ width: '100%', marginBottom: '15px', padding: '10px' }} onChange={e => setNewUser({...newUser, password: e.target.value})} />
            <select style={{ width: '100%', marginBottom: '20px', padding: '10px' }} onChange={e => setNewUser({...newUser, role: e.target.value})}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: primaryGreen, color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>Save</button>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '12px', backgroundColor: '#eee', border: 'none', borderRadius: '6px' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;