import React, { useEffect, useState, useCallback } from 'react';
import API from '../api';
import { API_BASE_URL } from '../api';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [uploadingId, setUploadingId] = useState(null);

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
    } catch (err) { console.error("Doctor Sync Error"); }
  }, [token]);

  useEffect(() => { 
    if (token) fetchDoctorData(); 
  }, [fetchDoctorData, token]);

  const getShortId = (id) => id ? id.toString().slice(-5).toUpperCase() : "74563";

  const handleUpload = async (patientId) => {
    if (!selectedFile) return alert("Select a PDF file.");
    const formData = new FormData();
    formData.append('report', selectedFile);
    formData.append('patientId', patientId);
    formData.append('doctorName', `Dr. ${doctorName}`);

    setUploadingId(patientId);
    try {
      await API.post('/reports/upload', formData, {
        headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
      });
      alert("Prescription Uploaded!");
      fetchDoctorData();
      setSelectedFile(null);
    } catch (err) { alert("Upload failed"); } finally { setUploadingId(null); }
  };

  const getReportUrl = (r) => {
    const fileName = r?.filePath?.split(/[/\\]/).pop(); 
    const base = API_BASE_URL.replace('/api', '');
    return `${base}/uploads/${fileName}`;
  };

  const headerStyle = { backgroundColor: '#f8f9fa', padding: '15px', textAlign: 'left', borderBottom: '2px solid #3498db' };
  const cellStyle = { padding: '15px', borderBottom: '1px solid #eee' };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1>Physician Portal: Dr. {doctorName}</h1>
      </header>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('upcoming')} style={{ padding: '12px 24px', backgroundColor: activeTab === 'upcoming' ? '#3498db' : '#eee', color: activeTab === 'upcoming' ? 'white' : '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Upcoming Schedule</button>
        <button onClick={() => setActiveTab('history')} style={{ padding: '12px 24px', backgroundColor: activeTab === 'history' ? '#3498db' : '#eee', color: activeTab === 'history' ? 'white' : '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Prescription Logs</button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        {activeTab === 'upcoming' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th style={headerStyle}>Patient Name</th><th style={headerStyle}>User ID</th><th style={headerStyle}>Appointment</th><th style={headerStyle}>Digital Rx</th></tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app._id}>
                  <td style={cellStyle}><strong>{app.userId?.name || "Patient"}</strong></td>
                  <td style={cellStyle}>#{getShortId(app.userId?._id)}</td>
                  <td style={cellStyle}>{app.date} at {app.time}</td>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <input type="file" accept=".pdf" onChange={(e) => setSelectedFile(e.target.files[0])} style={{ fontSize: '10px', width: '130px' }} />
                      <button onClick={() => handleUpload(app.userId?._id)} style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>{uploadingId === app.userId?._id ? "..." : "Upload"}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th style={headerStyle}>File Name</th><th style={headerStyle}>Patient ID</th><th style={headerStyle}>Action</th></tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r._id}>
                  <td style={cellStyle}>{r.fileName}</td><td style={cellStyle}>#{getShortId(r.patientId)}</td>
                  <td style={cellStyle}><a href={getReportUrl(r)} target="_blank" rel="noreferrer" style={{ color: '#3498db', fontWeight: 'bold' }}>View Rx</a></td>
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