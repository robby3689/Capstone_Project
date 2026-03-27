import React, { useEffect, useState } from 'react';
import API from '../api';
import { API_BASE_URL } from '../api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [tab, setTab] = useState('appointments'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [allReports, setAllReports] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedReportFile, setSelectedReportFile] = useState(null);
  
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
      
      const userRes = await API.get('/auth/all-users', config);
      const appntRes = await API.get('/appointments/all', config);
      const reportsRes = await API.get('/reports/all', config);

      setUsers(Array.isArray(userRes?.data) ? userRes.data : []);
      setAllAppointments(Array.isArray(appntRes?.data) ? appntRes.data : []);
      setAllReports(Array.isArray(reportsRes?.data) ? reportsRes.data : []);
    } catch (err) {
      console.error("Admin data fetch failed.");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', newUser);
      alert("User created successfully!");
      setShowAddModal(false);
      fetchAdminData();
    } catch (err) { alert("Failed to add user"); }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Permanently remove this patient from the records?")) {
      try {
        await API.delete(`/auth/user/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (err) { alert("Delete failed"); }
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (window.confirm("Cancel and delete this appointment?")) {
      try {
        await API.delete(`/appointments/cancel/${id}`);
        setAllAppointments(allAppointments.filter(a => a._id !== id));
      } catch (err) { alert("Failed to delete appointment"); }
    }
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm('Delete this prescription/report?')) return;
    try {
      await API.delete(`/reports/${id}`);
      setAllReports((prev) => (Array.isArray(prev) ? prev.filter((r) => r?._id !== id) : []));
    } catch {
      alert('Failed to delete report');
    }
  };

  const handleUploadReport = async () => {
    if (!selectedPatientId || !selectedReportFile) {
      alert('Choose a patient and PDF file first.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('report', selectedReportFile);
      formData.append('patientId', selectedPatientId);
      formData.append('doctorName', 'Admin');
      await API.post('/reports/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSelectedReportFile(null);
      setSelectedPatientId('');
      fetchAdminData();
      alert('Report uploaded.');
    } catch {
      alert('Failed to upload report.');
    }
  };

  const getReportUrl = (r) => {
    const path = String(r?.filePath ?? '');
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL.replace('/api', '')}/${path.replace(/\\/g, '/')}`;
  };

  const filteredUsers = (Array.isArray(users) ? users : []).filter((user) =>
    (user?.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user?.email ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const doctorUsers = (Array.isArray(users) ? users : []).filter((u) => {
    const role = String(u?.role ?? '').toLowerCase();
    return role === 'doctor' || role === 'staff';
  });
  const patientUsers = (Array.isArray(users) ? users : []).filter((u) => {
    const role = String(u?.role ?? '').toLowerCase();
    return role === 'patient' || role === 'user';
  });

  const doctorAvailability = doctorUsers.map((doctor) => {
    const assignedAppointments = (Array.isArray(allAppointments) ? allAppointments : []).filter((a) => {
      const doctorId = a?.doctorId?._id ?? a?.doctorId;
      const doctorName = String(a?.doctorName ?? '').toLowerCase();
      return String(doctorId ?? '') === String(doctor?._id ?? '') || doctorName === String(doctor?.name ?? '').toLowerCase();
    }).length;
    return {
      ...doctor,
      assignedAppointments,
      status: assignedAppointments > 0 ? 'Busy' : 'Available',
    };
  });

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
          <h2 style={{ color: darkGreen }}>{Array.isArray(users) ? users.length : 0}</h2>
        </div>
        <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: `6px solid ${warningOrange}` }}>
          <p style={{ color: '#666', margin: 0 }}>Active Appointments</p>
          <h2 style={{ color: darkGreen }}>{Array.isArray(allAppointments) ? allAppointments.length : 0}</h2>
        </div>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setTab('appointments')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: tab === 'appointments' ? darkGreen : '#eee', color: tab === 'appointments' ? 'white' : '#444', cursor: 'pointer' }}>Master Schedule</button>
        <button onClick={() => setTab('users')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: tab === 'users' ? darkGreen : '#eee', color: tab === 'users' ? 'white' : '#444', cursor: 'pointer' }}>User Management</button>
        <button onClick={() => setTab('prescriptions')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: tab === 'prescriptions' ? darkGreen : '#eee', color: tab === 'prescriptions' ? 'white' : '#444', cursor: 'pointer' }}>Prescriptions</button>
        <button onClick={() => setTab('doctors')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: tab === 'doctors' ? darkGreen : '#eee', color: tab === 'doctors' ? 'white' : '#444', cursor: 'pointer' }}>Doctor Availability</button>
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
              {(Array.isArray(allAppointments) ? allAppointments : []).map((app) => (
                <tr key={app?._id}>
                  <td style={cellStyle}>{app?.userEmail ?? app?.userId ?? '—'}</td>
                  <td style={cellStyle}>{app?.service ?? '—'}</td>
                  <td style={cellStyle}>{app?.date ?? '—'} at {app?.time ?? '—'}</td>
                  <td style={cellStyle}>
                    <button type="button" onClick={() => handleDeleteAppointment(app?._id)} style={{ color: dangerRed, border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : tab === 'users' ? (
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
        ) : tab === 'prescriptions' ? (
          <div style={{ padding: '18px' }}>
            <h3 style={{ marginTop: 0, color: darkGreen }}>Manage Prescriptions / Reports</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
              <select value={selectedPatientId} onChange={(e) => setSelectedPatientId(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <option value="">Select patient</option>
                {patientUsers.map((p) => (
                  <option key={p?._id} value={p?._id}>
                    {p?.name} ({p?.email})
                  </option>
                ))}
              </select>
              <input type="file" accept=".pdf" onChange={(e) => setSelectedReportFile(e?.target?.files?.[0] ?? null)} />
              <button type="button" onClick={handleUploadReport} style={{ backgroundColor: primaryGreen, color: 'white', border: 'none', borderRadius: '6px', padding: '10px 16px' }}>
                Upload
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Patient Id</th>
                  <th style={tableHeaderStyle}>File</th>
                  <th style={tableHeaderStyle}>Doctor</th>
                  <th style={tableHeaderStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(allReports) ? allReports : []).map((r) => (
                  <tr key={r?._id}>
                    <td style={cellStyle}>{String(r?.patientId ?? '').slice(-8) || '—'}</td>
                    <td style={cellStyle}>{r?.fileName ?? 'Report'}</td>
                    <td style={cellStyle}>{r?.doctorName ?? '—'}</td>
                    <td style={cellStyle}>
                      <a href={getReportUrl(r)} target="_blank" rel="noreferrer" style={{ marginRight: '10px' }}>
                        View
                      </a>
                      <a href={getReportUrl(r)} download style={{ marginRight: '10px' }}>
                        Download
                      </a>
                      <button type="button" onClick={() => handleDeleteReport(r?._id)} style={{ color: dangerRed, border: 'none', background: 'none', cursor: 'pointer' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '18px' }}>
            <h3 style={{ marginTop: 0, color: darkGreen }}>Doctor Availability Overview</h3>
            <p style={{ color: '#65756b' }}>
              Availability is calculated from appointments that include doctor assignment fields.
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Doctor</th>
                  <th style={tableHeaderStyle}>Email</th>
                  <th style={tableHeaderStyle}>Assigned Appointments</th>
                  <th style={tableHeaderStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {doctorAvailability.map((d) => (
                  <tr key={d?._id}>
                    <td style={cellStyle}>{d?.name ?? 'Doctor'}</td>
                    <td style={cellStyle}>{d?.email ?? '—'}</td>
                    <td style={cellStyle}>{d?.assignedAppointments ?? 0}</td>
                    <td style={cellStyle}>
                      <span style={{ padding: '4px 8px', borderRadius: '10px', backgroundColor: d?.status === 'Busy' ? '#fde9e6' : '#e9f7ef', color: d?.status === 'Busy' ? '#b63823' : '#1f7d42' }}>
                        {d?.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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