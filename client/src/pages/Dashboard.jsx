import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null); 
  const [editData, setEditData] = useState({ date: '', time: '' });
  
  const userId = localStorage.getItem('userId');
  const primaryGreen = '#27ae60';
  const darkGreen = '#1b4332';

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", 
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", 
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"
  ];

  useEffect(() => {
    fetchAppointments();
  }, [userId]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/appointments/user/${userId}`);
      setAppointments(res.data);
    } catch (err) {
      console.log("Error fetching appointments");
    }
  };

  const handleReschedule = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/reschedule/${id}`, editData);
      setEditingId(null);
      fetchAppointments(); 
      alert("Appointment updated successfully!");
    } catch (err) {
      alert("Update failed. Please try again.");
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await axios.delete(`http://localhost:5000/api/appointments/cancel/${id}`);
        setAppointments(appointments.filter(app => app._id !== id));
        alert("Appointment cancelled.");
      } catch (err) {
        alert("Cancellation failed.");
      }
    }
  };

  const tableHeaderStyle = { backgroundColor: '#f1f8f5', color: darkGreen, padding: '15px', textAlign: 'left', borderBottom: `2px solid ${primaryGreen}` };
  const cellStyle = { padding: '15px', borderBottom: '1px solid #eee' };
  const actionButtonStyle = { padding: '6px 12px', marginRight: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', border: '1px solid #ddd' };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', minHeight: '80vh' }}>
      <h2 style={{ color: darkGreen, marginBottom: '25px' }}>My Appointments</h2>
      
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
                      <button onClick={() => handleReschedule(app._id)} style={{ ...actionButtonStyle, backgroundColor: primaryGreen, color: 'white', border: 'none' }}>Save</button>
                      <button onClick={() => setEditingId(null)} style={actionButtonStyle}>Back</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={cellStyle}>{app.date}</td>
                    <td style={{ ...cellStyle, fontWeight: 'bold', color: primaryGreen }}>{app.time}</td>
                    <td style={cellStyle}>
                      <button 
                        style={{ ...actionButtonStyle, color: darkGreen }}
                        onClick={() => {
                          setEditingId(app._id);
                          setEditData({ date: app.date, time: app.time });
                        }}
                      >
                        Reschedule
                      </button>
                      <button 
                        style={{ ...actionButtonStyle, color: '#e74c3c', borderColor: '#e74c3c' }} 
                        onClick={() => handleCancel(app._id)}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                )}
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{ padding: '50px', textAlign: 'center', color: '#888' }}>
                  No upcoming appointments. <Link to="/book" style={{ color: primaryGreen, fontWeight: 'bold' }}>Book Now</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 style={{ color: darkGreen, marginBottom: '20px' }}>Medical Records</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', borderLeft: `6px solid ${primaryGreen}`, boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <h4 style={{ margin: '0 0 10px 0', color: darkGreen }}>Standard Lab Report</h4>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>Date: March 15, 2026</p>
          <a href="/sample-report.pdf" target="_blank" rel="noreferrer" style={{ color: primaryGreen, fontWeight: 'bold', textDecoration: 'none', fontSize: '14px' }}>View PDF Record</a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;