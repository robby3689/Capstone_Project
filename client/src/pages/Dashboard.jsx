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

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", 
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", 
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"
  ];

  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (userId) {
      fetchDashboardData();
    }
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      const appRes = await axios.get(`http://localhost:5000/api/appointments/user/${userId}`, config);
      setAppointments(appRes.data);
      
      const reportRes = await axios.get(`http://localhost:5000/api/reports/patient/${userId}`, config);
      setMyReports(reportRes.data);
    } catch (err) {
      console.log("Error fetching dashboard data");
    }
  };

  const handleReschedule = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/reschedule/${id}`, editData, config);
      setEditingId(null);
      fetchDashboardData(); 
      alert("Appointment rescheduled successfully!");
    } catch (err) {
      alert("Update failed. Please try again.");
    }
  };

  const handleCancel = async (appointmentId, appointmentDate) => {
    const now = new Date();
    const scheduledTime = new Date(appointmentDate);
    const diffInHours = (scheduledTime - now) / (1000 * 60 * 60);

    if (diffInHours < 24 && diffInHours > 0) {
      alert("Clinic Policy: 24-hour cancellation notice is required.");
      return;
    }

    if (window.confirm("Are you sure you want to cancel?")) {
      try {
        await axios.delete(`http://localhost:5000/api/appointments/cancel/${appointmentId}`, config);
        setAppointments(appointments.filter(app => app._id !== appointmentId));
        alert("Appointment cancelled.");
      } catch (err) {
        alert("Cancellation failed.");
      }
    }
  };

  const tableHeaderStyle = { backgroundColor: '#f1f8f5', color: darkGreen, padding: '15px', textAlign: 'left', borderBottom: `2px solid ${primaryGreen}` };
  const cellStyle = { padding: '15px', borderBottom: '1px solid #eee' };
  const actionButtonStyle = { padding: '6px 12px', marginRight: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', border: '1px solid #ddd', background: 'white' };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', minHeight: '80vh' }}>
      
      <div style={{ backgroundColor: darkGreen, color: 'white', padding: '30px', borderRadius: '12px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>Hello, {userName || 'Patient'}</h2>
          <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>Patient ID: {userId?.substring(0, 8)}...</p>
        </div>
        <Link to="/profile" style={{ backgroundColor: primaryGreen, color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          Edit Profile
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: darkGreen, margin: 0 }}>My Appointments</h2>
        <Link to="/book" style={{ color: primaryGreen, fontWeight: 'bold', textDecoration: 'none' }}>+ Book New</Link>
      </div>
      
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden', marginBottom: '50px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Service</th>
              <th style={tableHeaderStyle}>Date</th>
              <th style={tableHeaderStyle}>Time</th>
              <th style={tableHeaderStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? appointments.map((app) => (
              <tr key={app._id}>
                <td style={cellStyle}>{app.service}</td>
                {editingId === app._id ? (
                  <>
                    <td style={cellStyle}>
                      <input type="date" value={editData.date} onChange={(e) => setEditData({...editData, date: e.target.value})} />
                    </td>
                    <td style={cellStyle}>
                      <select value={editData.time} onChange={(e) => setEditData({...editData, time: e.target.value})}>
                        {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                      </select>
                    </td>
                    <td style={cellStyle}>
                      <button onClick={() => handleReschedule(app._id)} style={{ ...actionButtonStyle, backgroundColor: primaryGreen, color: 'white' }}>Save</button>
                      <button onClick={() => setEditingId(null)} style={actionButtonStyle}>Back</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={cellStyle}>{app.date}</td>
                    <td style={{ ...cellStyle, fontWeight: 'bold', color: primaryGreen }}>{app.time}</td>
                    <td style={cellStyle}>
                      <button style={{ ...actionButtonStyle, color: darkGreen }} onClick={() => { setEditingId(app._id); setEditData({ date: app.date, time: app.time }); }}>Reschedule</button>
                      <button style={{ ...actionButtonStyle, color: '#e74c3c', borderColor: '#e74c3c' }} onClick={() => handleCancel(app._id, app.date)}>Cancel</button>
                    </td>
                  </>
                )}
              </tr>
            )) : (
              <tr><td colSpan="4" style={{ padding: '50px', textAlign: 'center' }}>No appointments.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 style={{ color: darkGreen, marginBottom: '20px' }}>Digital Medical Records</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {myReports.length > 0 ? myReports.map((report) => (
          <div key={report._id} style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', borderLeft: `6px solid ${primaryGreen}`, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 5px 0', color: darkGreen }}>{report.fileName}</h4>
            <p style={{ fontSize: '12px', color: '#666' }}>Uploaded by Dr. {report.doctorName}</p>
            <a href={`http://localhost:5000/${report.filePath}`} target="_blank" rel="noreferrer" style={{ color: primaryGreen, fontWeight: 'bold', textDecoration: 'none', fontSize: '14px' }}>Download PDF</a>
          </div>
        )) : (
          <p style={{ color: '#888' }}>No medical records available yet.</p>
        )}
      </div>
    </div>
  );
};
export default Dashboard;