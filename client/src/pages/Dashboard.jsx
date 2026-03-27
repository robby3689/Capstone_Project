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

  const handlePatientCancel = async (id) => {
    if (!window.confirm("Cancel your appointment?")) return;
    try {
      await API.put(`/appointments/status/${id}`, { status: 'Cancelled' }, { headers: { Authorization: `Bearer ${token}` } });
      fetchDashboardData();
    } catch (err) { alert("Failed to cancel."); }
  };

  const getReportDownloadUrl = (report) => {
    const filePath = report?.filePath ?? '';
    const base = API_BASE_URL.replace('/api', '');
    // Ensure we remove 'public/' if it exists in path for local download
    const cleanPath = filePath.replace('public/', '').replace(/\\/g, '/');
    return `${base}/${cleanPath}`;
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>
      <div style={{ backgroundColor: '#1b4332', color: 'white', padding: '35px', borderRadius: '15px', marginBottom: '30px' }}>
        <h2 style={{ margin: 0 }}>Welcome Back, {userName}</h2>
        <p style={{ marginTop: '10px' }}>Your Official ID: <code>#{userId?.slice(-5).toUpperCase() || "74563"}</code></p>
      </div>

      <div style={{ marginBottom: '50px' }}>
        <h3>My Scheduled Visits</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', marginTop: '15px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f8f5' }}>
              <th style={{ padding: '15px', textAlign: 'left' }}>Service</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((app) => (
              <tr key={app._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>{app.service}</td>
                <td style={{ padding: '15px' }}>{app.date} at {app.time}</td>
                <td style={{ padding: '15px' }}>
                  {app.status === 'Cancelled' ? <span style={{color:'red'}}>Cancelled</span> : (
                     <button onClick={() => handlePatientCancel(app._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Cancel Visit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3>My Prescriptions</h3>
        <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
          {myReports.map((r) => (
            <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #eee' }}>
              <div><strong>Prescription from {r.doctorName}</strong></div>
              <a href={getReportDownloadUrl(r)} target="_blank" rel="noreferrer" style={{ backgroundColor: '#27ae60', color: 'white', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>DOWNLOAD PDF</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;