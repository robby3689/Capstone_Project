import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api';
import { API_BASE_URL } from '../api';

const DoctorDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'appointments');

  const name = localStorage.getItem('name');
  const token = localStorage.getItem('token');

  const fetchDoctorData = useCallback(async () => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const [appntRes, reportRes] = await Promise.all([
        API.get('/appointments/all', config),
        API.get('/reports/all', config),
      ]);
      setAppointments(Array.isArray(appntRes.data) ? appntRes.data : []);
      setReports(Array.isArray(reportRes.data) ? reportRes.data : []);
    } catch (err) { console.error('Fetch failed', err); }
  }, [token]);

  useEffect(() => { fetchDoctorData(); }, [fetchDoctorData]);

  // HELPER: Professional 5-digit ID
  const getShortId = (longId) => {
    if(!longId) return "74563";
    let hash = 0;
    for (let i = 0; i < longId.length; i++) {
      hash = longId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 90000) + 10000; 
  };

  const handleUpload = async (userId) => {
    if (!selectedFile) return alert('Select a PDF file');
    const formData = new FormData();
    formData.append('report', selectedFile);
    formData.append('patientId', userId);
    formData.append('doctorName', name ?? 'Clinic Physician');

    setUploadingId(userId);
    try {
      await API.post('/reports/upload', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      alert('Prescription Uploaded!');
      fetchDoctorData();
      setSelectedFile(null);
    } catch { alert('Upload failed.'); }
    setUploadingId(null);
  };

  const getReportUrl = (r) => {
    const filePath = r?.filePath ?? '';
    // Extract filename only to prevent path errors
    const fileName = filePath.split(/[/\\]/).pop(); 
    const base = API_BASE_URL.replace('/api', '');
    return `${base}/uploads/${fileName}`;
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Doctor Portal: Dr. {name}</h2>
      <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        <button onClick={() => setActiveTab('appointments')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'appointments' ? '#1b4332' : '#eee', color: activeTab === 'appointments' ? 'white' : '#333', cursor:'pointer' }}>Appointments</button>
        <button onClick={() => setActiveTab('prescriptions')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'prescriptions' ? '#1b4332' : '#eee', color: activeTab === 'prescriptions' ? 'white' : '#333', cursor:'pointer' }}>History</button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {activeTab === 'appointments' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f8f5' }}><th style={{ padding: '15px', textAlign: 'left' }}>Patient Name</th><th style={{ padding: '15px', textAlign: 'left' }}>User ID</th><th style={{ padding: '15px', textAlign: 'left' }}>Upload Prescription</th></tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px' }}>{app?.userId?.name || 'Patient'}</td>
                  <td style={{ padding: '15px' }}><code>#{getShortId(app?.userId?._id)}</code></td>
                  <td style={{ padding: '15px' }}>
                    <input type="file" accept=".pdf" onChange={(e) => setSelectedFile(e.target.files[0])} />
                    <button onClick={() => handleUpload(app?.userId?._id)} style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                      {uploadingId === app?.userId?._id ? "Uploading..." : "Upload PDF"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f8f5' }}><th style={{ padding: '15px', textAlign: 'left' }}>File Name</th><th style={{ padding: '15px', textAlign: 'left' }}>User ID</th><th style={{ padding: '15px', textAlign: 'left' }}>Action</th></tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px' }}>{r.fileName}</td>
                  <td style={{ padding: '15px' }}><code>#{getShortId(r.patientId)}</code></td>
                  <td style={{ padding: '15px' }}><a href={getReportUrl(r)} target="_blank" rel="noreferrer" style={{color:'#27ae60', fontWeight:'bold'}}>View PDF</a></td>
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