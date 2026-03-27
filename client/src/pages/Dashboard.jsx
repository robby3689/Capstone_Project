import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [myReports, setMyReports] = useState([]);

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
        setMyReports([]);
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

  const safeApps = Array.isArray(appointments) ? appointments : [];

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

      <h2 style={{ color: darkGreen }}>My Appointments</h2>
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
              <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {safeApps.length > 0 ? (
              safeApps.map((app) => (
                <tr key={app?._id ?? app?.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px' }}>{app?.service ?? '—'}</td>
                  <td style={{ padding: '15px' }}>
                    {app?.date ?? '—'} at {app?.time ?? '—'}
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
                <td colSpan={3} style={{ padding: '20px', textAlign: 'center' }}>
                  No appointments.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {Array.isArray(myReports) && myReports.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ color: darkGreen }}>Recent reports</h3>
          <ul style={{ paddingLeft: '20px', color: '#444' }}>
            {myReports.map((r) => (
              <li key={r?._id ?? r?.id}>{r?.fileName ?? 'Report'}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
