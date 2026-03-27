import React, { useEffect, useState, useCallback } from 'react';
import API from '../api';
import { API_BASE_URL } from '../api';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming'); // Default to schedule

  const token = localStorage.getItem('token');
  const doctorName = localStorage.getItem('name');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchDoctorData = useCallback(async () => {
    try {
      const [appRes, reportRes] = await Promise.all([
        API.get('/appointments/all', config),
        API.get('/reports/all', config)
      ]);
      setAppointments(appRes.data || []);
      setReports(reportRes.data || []);
    } catch (err) {
      console.error("Doctor Data Sync Error");
    }
  }, [token]);

  useEffect(() => { fetchDoctorData(); }, [fetchDoctorData]);

  // HELPER: Professional 5-digit ID logic
  const getShortId = (id) => id ? id.toString().slice(-5).toUpperCase() : "74563";

  const handleUpload = async (patientId) => {
    if (!selectedFile) return alert("Select a PDF prescription first.");
    const formData = new FormData();
    formData.append('report', selectedFile);
    formData.append('patientId', patientId);
    formData.append('doctorName', `Dr. ${doctorName}`);

    try {
      await API.post('/reports/upload', formData, {
        headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
      });
      alert("Prescription Uploaded Successfully!");
      fetchDoctorData();
      setSelectedFile(null);
    } catch (err) { alert("Upload failed"); }
  };

  const getReportUrl = (r) => {
    const fileName = r?.filePath?.split(/[/\\]/).pop(); 
    return `${API_BASE_URL.replace('/api', '')}/uploads/${fileName}`;
  };

  const headerStyle = { backgroundColor: '#f8f9fa', padding: '15px', textAlign: 'left', borderBottom: '2px solid #3498db', color: '#2c3e50' };
  const cellStyle = { padding: '15px', borderBottom: '1px solid #eee' };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px', fontFamily: 'inherit' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#1b4332', margin: 0 }}>Physician Portal</h1>
        <p style={{ color: '#666' }}>Welcome, Dr. {doctorName} | Managing {appointments.length} Appointments</p>
      </header>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('upcoming')} style={{ padding: '12px 24px', backgroundColor: activeTab === 'upcoming' ? '#3498db' : '#eee', color: activeTab === 'upcoming' ? 'white' : '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Upcoming Appointments</button>
        <button onClick={() => setActiveTab('history')} style={{ padding: '12px 24px', backgroundColor: activeTab === 'history' ? '#3498db' : '#eee', color: activeTab === 'history' ? 'white' : '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Prescription History</button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        {activeTab === 'upcoming' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerStyle}>Patient Name</th>
                <th style={headerStyle}>User ID</th>
                <th style={headerStyle}>Appointment Time</th>
                <th style={headerStyle}>Service</th>
                <th style={headerStyle}>Digital Rx</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app._id}>
                  <td style={cellStyle}><strong>{app.userId?.name || "Patient"}</strong></td>
                  <td style={cellStyle}><code>#{getShortId(app.userId?._id)}</code></td>
                  <td style={cellStyle}>{app.date} at {app.time}</td>
                  <td style={cellStyle}>{app.service}</td>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <input type="file" accept=".pdf" onChange={(e) => setSelectedFile(e.target.files[0])} style={{ fontSize: '10px', width: '140px' }} />
                      <button onClick={() => handleUpload(app.userId?._id)} style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Upload</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerStyle}>File Name</th>
                <th style={headerStyle}>Patient ID</th>
                <th style={headerStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r._id}>
                  <td style={cellStyle}>{r.fileName}</td>
                  <td style={cellStyle}>#{getShortId(r.patientId)}</td>
                  <td style={cellStyle}><a href={getReportUrl(r)} target="_blank" rel="noreferrer" style={{ color: '#3498db', fontWeight: 'bold', textDecoration: 'none' }}>View Document</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;