import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [myReports, setMyReports] = useState([]); 
  const [editingId, setEditingId] = useState(null); 
  const [editData, setEditData] = useState({ date: '', time: '' });
  
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('name');
  const token = localStorage.getItem('token');
  const primaryGreen = '#27ae60';
  const darkGreen = '#1b4332';

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (userId && token) {
      fetchDashboardData();
    }
  }, [userId, token]);

  const fetchDashboardData = async () => {
    try {
      const appRes = await axios.get(`https://evergreen-clinic-backend.onrender.com/api/appointments/user/${userId}`, config);
      setAppointments(Array.isArray(appRes.data) ? appRes.data : []);
      
      try {
        const reportRes = await axios.get(`https://evergreen-clinic-backend.onrender.com/api/reports/patient/${userId}`, config);
        setMyReports(Array.isArray(reportRes.data) ? reportRes.data : []);
      } catch (reportErr) {
        console.log("Reports not found (404), which is fine for now.");
        setMyReports([]);
      }

    } catch (err) {
      console.error("Fetch Error:", err);
      setAppointments([]);
      setMyReports([]);
    }
  };
  const handleReschedule = async (id) => {
    try {
      await axios.put(`https://evergreen-clinic-backend.onrender.com/api/appointments/reschedule/${id}`, editData, config);
      setEditingId(null);
      fetchDashboardData(); 
      alert("Success!");
    } catch (err) { alert("Error updating."); }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Cancel this?")) {
      try {
        await axios.delete(`https://evergreen-clinic-backend.onrender.com/api/appointments/cancel/${id}`, config);
        fetchDashboardData();
      } catch (err) { alert("Failed."); }
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px', minHeight: '80vh' }}>
      <div style={{ backgroundColor: darkGreen, color: 'white', padding: '30px', borderRadius: '12px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>Welcome, {userName || 'Patient'}</h2>
          <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>ID: {userId?.substring(0, 8)}</p>
        </div>
        <Link to="/profile" style={{ backgroundColor: primaryGreen, color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none' }}>Profile</Link>
      </div>

      <h2 style={{ color: darkGreen }}>My Appointments</h2>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f8f5' }}>
              <th style={{ padding: '15px', textAlign: 'left' }}>Service</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? appointments.map((app) => (
              <tr key={app._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}>{app.service}</td>
                <td style={{ padding: '15px' }}>{app.date} at {app.time}</td>
                <td style={{ padding: '15px' }}>
                  <button onClick={() => handleCancel(app._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Cancel</button>
                </td>
              </tr>
            )) : <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center' }}>No appointments.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Dashboard;