import React, { useEffect, useState, useCallback } from 'react';
import API from '../api';
import { API_BASE_URL } from '../api';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('name');
  const token = localStorage.getItem('token');

  const fetchDashboardData = useCallback(async () => {
    if (!userId || !token) return;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const appRes = await API.get(`/appointments/user/${userId}`, config);
      setAppointments(Array.isArray(appRes.data) ? appRes.data : []);
      
      const reportRes = await API.get(`/reports/patient/${userId}`, config);
      setMyReports(Array.isArray(reportRes.data) ? reportRes.data : []);
    } catch (err) { console.error('Fetch Error:', err); }
  }, [userId, token]);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  const getReportDownloadUrl = (report) => {
    const filePath = report?.filePath ?? '';
    const base = API_BASE_URL.replace('/api', '');
    return `${base}/${filePath.replace(/\\/g, '/')}`;
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>
      <div style={{ backgroundColor: '#1b4332', color: 'white', padding: '30px', borderRadius: '12px', marginBottom: '30px' }}>
        <h2>Welcome Back, {userName}</h2>
        <p>Your User ID: <code>{userId}</code></p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h3>My Appointments</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', marginTop: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f8f5' }}><th style={{ padding: '15px', textAlign: 'left' }}>Service</th><th style={{ padding: '15px', textAlign: 'left' }}>Date</th><th style={{ padding: '15px', textAlign: 'left' }}>Status</th></tr>
          </thead>
          <tbody>
            {appointments.map((app) => (
              <tr key={app._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}>{app.service}</td>
                <td style={{ padding: '15px' }}>{app.date} at {app.time}</td>
                <td style={{ padding: '15px' }}><span style={{ color: app.status === 'Cancelled' ? 'red' : '#27ae60', fontWeight: 'bold' }}>{app.status || 'Active'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3>My Prescriptions</h3>
        <div style={{ marginTop: '20px' }}>
          {myReports.length > 0 ? myReports.map((r) => (
            <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '20px', borderRadius: '10px', marginBottom: '10px', border: '1px solid #eee' }}>
              <div><strong>Prescription from {r.doctorName}</strong></div>
              <a href={getReportDownloadUrl(r)} target="_blank" rel="noreferrer" style={{ backgroundColor: '#27ae60', color: 'white', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>View PDF</a>
            </div>
          )) : <p>No prescriptions yet.</p>}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;