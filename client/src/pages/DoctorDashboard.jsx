import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api';
import { API_BASE_URL } from '../api';

const DoctorDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'appointments');
  const [manualPatientId, setManualPatientId] = useState('');

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

  useEffect(() => {
    const urlTab = searchParams.get('tab');
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [searchParams, activeTab]);

  const changeTab = (nextTab) => {
    setActiveTab(nextTab);
    setSearchParams({ tab: nextTab });
  };

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
  const safeReports = Array.isArray(reports) ? reports : [];

  const getReportUrl = (r) => {
    const path = String(r?.filePath ?? '');
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL.replace('/api', '')}/${path.replace(/\\/g, '/')}`;
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm('Delete this report?')) return;
    try {
      await API.delete(`/reports/${id}`);
      setReports((prev) => (Array.isArray(prev) ? prev.filter((r) => r?._id !== id) : []));
    } catch {
      alert('Failed to delete report.');
    }
  };

  const handleManualUpload = async () => {
    if (!manualPatientId || !selectedFile) {
      alert('Enter patientId and select a PDF file.');
      return;
    }
    const formData = new FormData();
    formData.append('report', selectedFile);
    formData.append('patientId', manualPatientId);
    formData.append('doctorName', name ?? '');
    try {
      setUploading(true);
      await API.post('/reports/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setManualPatientId('');
      setSelectedFile(null);
      fetchDoctorData();
      alert('Report uploaded.');
    } catch {
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: darkGreen }}>
        Clinical Portal: Dr. {name ?? 'Physician'}
      </h2>
      <p style={{ color: '#52796f', marginBottom: '20px' }}>
        Reports on file: {Array.isArray(reports) ? reports.length : 0}
      </p>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
        <button
          type="button"
          onClick={() => changeTab('appointments')}
          style={{ border: 'none', borderRadius: '8px', padding: '10px 14px', backgroundColor: activeTab === 'appointments' ? darkGreen : '#e8ecef', color: activeTab === 'appointments' ? 'white' : '#333' }}
        >
          Appointments
        </button>
        <button
          type="button"
          onClick={() => changeTab('prescriptions')}
          style={{ border: 'none', borderRadius: '8px', padding: '10px 14px', backgroundColor: activeTab === 'prescriptions' ? darkGreen : '#e8ecef', color: activeTab === 'prescriptions' ? 'white' : '#333' }}
        >
          Prescriptions
        </button>
      </div>
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}
      >
        {activeTab === 'appointments' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f8f5' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>Patient Name</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Service</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {safeApps.length > 0 ? (
                safeApps.map((app) => (
                  <tr key={app?._id ?? app?.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px' }}>{app?.userId?.name ?? 'Patient'}</td>
                    <td style={{ padding: '15px' }}>{app?.service ?? '—'}</td>
                    <td style={{ padding: '15px' }}>{app?.date ?? '—'} {app?.time ?? ''}</td>
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
                  <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#666' }}>
                    No appointments scheduled.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <div>
            <div style={{ padding: '14px', borderBottom: '1px solid #eee', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Patient ID"
                value={manualPatientId}
                onChange={(e) => setManualPatientId(e.target.value)}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px', minWidth: '220px' }}
              />
              <input type="file" accept=".pdf" onChange={(e) => setSelectedFile(e?.target?.files?.[0] ?? null)} />
              <button type="button" disabled={uploading} onClick={handleManualUpload} style={{ backgroundColor: primaryGreen, color: 'white', border: 'none', borderRadius: '8px', padding: '10px 14px' }}>
                Upload
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f8f5' }}>
                  <th style={{ padding: '15px', textAlign: 'left' }}>File</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Patient Id</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeReports.length > 0 ? (
                  safeReports.map((report) => (
                    <tr key={report?._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '15px' }}>{report?.fileName ?? 'Report'}</td>
                      <td style={{ padding: '15px' }}>{String(report?.patientId ?? '').slice(-8) || '—'}</td>
                      <td style={{ padding: '15px' }}>
                        <a href={getReportUrl(report)} target="_blank" rel="noreferrer" style={{ marginRight: '10px' }}>
                          View
                        </a>
                        <a href={getReportUrl(report)} download style={{ marginRight: '10px' }}>
                          Download
                        </a>
                        <button type="button" onClick={() => handleDeleteReport(report?._id)} style={{ color: dangerRed, border: 'none', background: 'none', cursor: 'pointer' }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ padding: '24px', textAlign: 'center', color: '#666' }}>
                      No prescriptions uploaded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
