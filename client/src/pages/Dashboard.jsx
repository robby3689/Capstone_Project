import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { API_BASE_URL } from '../api';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [rescheduleById, setRescheduleById] = useState({});

  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('name');
  const token = localStorage.getItem('token');
  const primaryGreen = '#27ae60';
  const darkGreen = '#1b4332';

  const fetchDashboardData = useCallback(async () => {
    if (!userId || !token) return;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const appRes = await API.get(`/appointments/user/${userId}`, config);
      const rawApps = appRes?.data;
      setAppointments(Array.isArray(rawApps) ? rawApps : []);

      try {
        const reportRes = await API.get(`/reports/patient/${userId}`, config);
        const rawReports = reportRes?.data;
        setMyReports(Array.isArray(rawReports) ? rawReports : []);
      } catch {
        try {
          const fallback = await API.get('/reports/all', config);
          const allReports = Array.isArray(fallback?.data) ? fallback.data : [];
          const ownReports = allReports.filter((r) => String(r?.patientId) === String(userId));
          setMyReports(ownReports);
        } catch {
          setMyReports([]);
        }
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      setAppointments([]);
      setMyReports([]);
    }
  }, [userId, token]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await API.delete(`/appointments/cancel/${id}`, config);
      fetchDashboardData();
    } catch {
      alert('Failed.');
    }
  };

  const handleReschedule = async (id) => {
    const chosen = rescheduleById[id] ?? {};
    if (!chosen.date || !chosen.time) {
      alert('Choose both date and time before rescheduling.');
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await API.put(`/appointments/reschedule/${id}`, { date: chosen.date, time: chosen.time }, config);
      alert('Appointment updated.');
      fetchDashboardData();
    } catch {
      alert('Failed to reschedule appointment.');
    }
  };

  const handleRescheduleField = (id, field, value) => {
    setRescheduleById((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const getReportDownloadUrl = (report) => {
    const filePath = report?.filePath ?? '';
    if (filePath.startsWith('http')) return filePath;
    const base = API_BASE_URL.replace('/api', '');
    return `${base}/${String(filePath).replace(/\\/g, '/')}`;
  };

  const safeApps = Array.isArray(appointments) ? appointments : [];
  const now = Date.now();
  const upcomingAppointments = safeApps.filter((app) => {
    const stamp = Date.parse(`${app?.date ?? ''} ${app?.time ?? ''}`);
    return Number.isFinite(stamp) ? stamp >= now : true;
  });
  const pastAppointments = safeApps.filter((app) => !upcomingAppointments.includes(app));
  const displayedAppointments = activeTab === 'all' ? safeApps : upcomingAppointments;

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px', minHeight: '80vh' }}>
      <div
        style={{
          backgroundColor: darkGreen,
          color: 'white',
          padding: '30px',
          borderRadius: '12px',
          marginBottom: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Welcome, {userName ?? 'Patient'}</h2>
          <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>
            ID: {userId ? `${String(userId).substring(0, 8)}…` : '—'}
          </p>
        </div>
        <Link
          to="/profile"
          style={{
            backgroundColor: primaryGreen,
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            textDecoration: 'none',
          }}
        >
          Profile
        </Link>
      </div>

      <h2 style={{ color: darkGreen }}>My Health Info</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          style={{
            border: 'none',
            padding: '10px 14px',
            borderRadius: '8px',
            backgroundColor: activeTab === 'upcoming' ? darkGreen : '#e8ecef',
            color: activeTab === 'upcoming' ? 'white' : '#333',
            cursor: 'pointer',
          }}
        >
          Upcoming ({upcomingAppointments.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          style={{
            border: 'none',
            padding: '10px 14px',
            borderRadius: '8px',
            backgroundColor: activeTab === 'all' ? darkGreen : '#e8ecef',
            color: activeTab === 'all' ? 'white' : '#333',
            cursor: 'pointer',
          }}
        >
          All ({safeApps.length})
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
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f8f5' }}>
              <th style={{ padding: '15px', textAlign: 'left' }}>Service</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Details</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Reschedule</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedAppointments.length > 0 ? (
              displayedAppointments.map((app) => (
                <tr key={app?._id ?? app?.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px' }}>{app?.service ?? '—'}</td>
                  <td style={{ padding: '15px' }}>
                    #{String(app?._id ?? app?.id ?? '').slice(-6)} | {app?.status ?? 'booked'}
                  </td>
                  <td style={{ padding: '15px' }}>
                    {app?.date ?? '—'} at {app?.time ?? '—'}
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="date"
                        value={rescheduleById[app?._id ?? app?.id]?.date ?? ''}
                        onChange={(e) => handleRescheduleField(app?._id ?? app?.id, 'date', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="10:00 AM"
                        value={rescheduleById[app?._id ?? app?.id]?.time ?? ''}
                        onChange={(e) => handleRescheduleField(app?._id ?? app?.id, 'time', e.target.value)}
                        style={{ width: '100px' }}
                      />
                      <button type="button" onClick={() => handleReschedule(app?._id ?? app?.id)}>
                        Update
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <button
                      type="button"
                      onClick={() => handleCancel(app?._id ?? app?.id)}
                      style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: '20px', textAlign: 'center' }}>
                  No appointments.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {Array.isArray(myReports) && myReports.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ color: darkGreen }}>Prescriptions & Reports</h3>
          <p style={{ color: '#5c6b63' }}>View or download your documents.</p>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '14px 16px' }}>
            {myReports.map((r) => (
              <div
                key={r?._id ?? r?.id}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #efefef', padding: '8px 0' }}
              >
                <div>{r?.fileName ?? 'Report'}</div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <a href={getReportDownloadUrl(r)} target="_blank" rel="noreferrer">
                    View
                  </a>
                  <a href={getReportDownloadUrl(r)} download>
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pastAppointments.length > 0 && (
        <div style={{ marginTop: '24px', color: '#637169' }}>
          Past appointments: {pastAppointments.length}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
