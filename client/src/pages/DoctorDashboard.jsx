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
      // Only show appointments that aren't cancelled for the "Upcoming" view if preferred, 
      // otherwise show all as currently mapped.
      setAppointments(Array.isArray(appRes.data) ? appRes.data : []);
      setReports(Array.isArray(reportRes.data) ? reportRes.data : []);
    } catch (err) {
      console.error("Doctor Data Sync Error: check if /appointments/all route is restricted to staff");
    }
  }, [token]);

  useEffect(() => { 
    if (token) fetchDoctorData(); 
  }, [fetchDoctorData, token]);

  // HELPER: Consistent 5-digit ID logic
  const getShortId = (id) => id ? id.toString().slice(-5).toUpperCase() : "74563";

  const handleUpload = async (patientId) => {
    if (!selectedFile) return alert("Please select a PDF prescription file first.");
    
    const formData = new FormData();
    formData.append('report', selectedFile);
    formData.append('patientId', patientId);
    formData.append('doctorName', `Dr. ${doctorName}`);

    setUploadingId(patientId);
    try {
      await API.post('/reports/upload', formData, {
        headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
      });
      alert("Prescription Uploaded Successfully!");
      fetchDoctorData(); // Refresh history
      setSelectedFile(null);
      // Clear file input manually if needed via ref, or just rely on state
    } catch (err) { 
      alert("Upload failed. Ensure the file is a PDF and under 5MB."); 
    } finally {
      setUploadingId(null);
    }
  };

  const getReportUrl = (r) => {
    const filePath = r?.filePath ?? '';
    const fileName = filePath.split(/[/\\]/).pop(); 
    const base = API_BASE_URL.replace('/api', '');
    return `${base}/uploads/${fileName}`;
  };

  const headerStyle = { backgroundColor: '#f8f9fa', padding: '15px', textAlign: 'left', borderBottom: '2px solid #3498db', color: '#2c3e50' };
  const cellStyle = { padding: '15px', borderBottom: '1px solid #eee' };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px' }}>
      <header style={{ marginBottom: '30px', borderLeft: '5px solid #3498db', paddingLeft: '20px' }}>
        <h1 style={{ color: '#1b4332', margin: 0 }}>Doctor Console</h1>
        <p style={{ color: '#666', marginTop: '5px' }}>Logged in: Dr. {doctorName} | Active Cases: {appointments.length}</p>
      </header>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
        <button 
          onClick={() => setActiveTab('upcoming')} 
          style={{ padding: '12px 24px', backgroundColor: activeTab === 'upcoming' ? '#3498db' : '#f0f0f0', color: activeTab === 'upcoming' ? 'white' : '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}
        >
          Upcoming Schedule
        </button>
        <button 
          onClick={() => setActiveTab('history')} 
          style={{ padding: '12px 24px', backgroundColor: activeTab === 'history' ? '#3498db' : '#f0f0f0', color: activeTab === 'history' ? 'white' : '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}
        >
          Prescription Logs
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        {activeTab === 'upcoming' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerStyle}>Patient Name</th>
                <th style={headerStyle}>User ID</th>
                <th style={headerStyle}>Date & Time</th>
                <th style={headerStyle}>Service Requested</th>
                <th style={headerStyle}>Quick Upload (PDF)</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? appointments.map((app) => (
                <tr key={app._id}>
                  <td style={cellStyle}><strong>{app.userId?.name || "Registered Patient"}</strong></td>
                  <td style={cellStyle}><code>#{getShortId(app.userId?._id)}</code></td>
                  <td style={cellStyle}>{app.date} at {app.time}</td>
                  <td style={cellStyle}><span style={{ backgroundColor: '#eef2f7', padding: '4px 8px', borderRadius: '4px', fontSize: '13px' }}>{app.service}</span></td>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="file" 
                        accept=".pdf" 
                        onChange={(e) => setSelectedFile(e.target.files[0])} 
                        style={{ fontSize: '11px', width: '150px' }} 
                      />
                      <button 
                        onClick={() => handleUpload(app.userId?._id)} 
                        disabled={uploadingId === app.userId?._id}
                        style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                      >
                        {uploadingId === app.userId?._id ? "..." : "Send Rx"}
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No upcoming appointments scheduled.</td></tr>
              )}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerStyle}>Document Name</th>
                <th style={headerStyle}>Patient ID</th>
                <th style={headerStyle}>Upload Date</th>
                <th style={headerStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.length > 0 ? reports.map((r) => (
                <tr key={r._id}>
                  <td style={cellStyle}>{r.fileName}</td>
                  <td style={cellStyle}><code>#{getShortId(r.patientId)}</code></td>
                  <td style={cellStyle}>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td style={cellStyle}>
                    <a href={getReportUrl(r)} target="_blank" rel="noreferrer" style={{ color: '#3498db', fontWeight: 'bold', textDecoration: 'none', border: '1px solid #3498db', padding: '4px 10px', borderRadius: '4px' }}>
                      Open PDF
                    </a>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No prescription history found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;