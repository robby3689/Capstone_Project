import React, { useEffect, useState, useCallback } from 'react';
import API from '../api';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const name = localStorage.getItem('name');
  const token = localStorage.getItem('token');
  const primaryGreen = '#27ae60';
  const darkGreen = '#1b4332';
  const dangerRed = '#e74c3c';

  const fetchDoctorData = useCallback(async () => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const [appntRes, reportRes] = await Promise.all([
        API.get('/appointments/all', config),
        API.get('/reports/all', config),
      ]);
      const apps = appntRes?.data;
      const reps = reportRes?.data;
      setAppointments(Array.isArray(apps) ? apps : []);
      setReports(Array.isArray(reps) ? reps : []);
    } catch (err) {
      console.error('Fetch failed', err);
      setAppointments([]);
      setReports([]);
    }
  }, [token]);

  useEffect(() => {
    fetchDoctorData();
  }, [fetchDoctorData]);

  const handleUpload = async (app) => {
    const patientId = app?.userId?._id ?? app?.userId;
    if (!selectedFile) {
      alert('Select a PDF file');
      return;
    }
    if (!patientId) {
      alert('Missing patient reference for this appointment.');
      return;
    }
    const formData = new FormData();
    formData.append('report', selectedFile);
    formData.append('patientId', patientId);
    formData.append('doctorName', name ?? '');

    setUploading(true);
    try {
      const authHeader = { Authorization: `Bearer ${token}` };
      await API.post('/reports/upload', formData, {
        headers: { ...authHeader, 'Content-Type': 'multipart/form-data' },
      });
      alert('Success!');
      fetchDoctorData();
    } catch {
      alert('Failed.');
    }
    setUploading(false);
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm('Delete?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await API.delete(`/appointments/cancel/${id}`, config);
      setAppointments((prev) => (Array.isArray(prev) ? prev.filter((a) => a?._id !== id) : []));
    } catch {
      alert('Failed.');
    }
  };

  const safeApps = Array.isArray(appointments) ? appointments : [];

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: darkGreen }}>
        Clinical Portal: Dr. {name ?? 'Physician'}
      </h2>
      <p style={{ color: '#52796f', marginBottom: '20px' }}>
        Reports on file: {Array.isArray(reports) ? reports.length : 0}
      </p>
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f8f5' }}>
              <th style={{ padding: '15px', textAlign: 'left' }}>Patient Name</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Service</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {safeApps.length > 0 ? (
              safeApps.map((app) => (
                <tr key={app?._id ?? app?.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px' }}>{app?.userId?.name ?? 'Patient'}</td>
                  <td style={{ padding: '15px' }}>{app?.service ?? '—'}</td>
                  <td style={{ padding: '15px' }}>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setSelectedFile(e?.target?.files?.[0] ?? null)}
                    />
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => handleUpload(app)}
                      style={{ backgroundColor: primaryGreen, color: 'white', padding: '5px' }}
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteAppointment(app?._id ?? app?.id)}
                      style={{ color: dangerRed, marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ padding: '24px', textAlign: 'center', color: '#666' }}>
                  No appointments scheduled.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorDashboard;
