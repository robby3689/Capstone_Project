import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [tempNote, setTempNote] = useState('');
  const name = localStorage.getItem('name');
  const primaryGreen = '#27ae60';

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/appointments/all');
      setAppointments(res.data);
    } catch (err) { console.log("Error fetching data"); }
  };

  const handleSaveNote = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/reschedule/${id}`, { doctorNote: tempNote });
      alert("Doctor's note updated.");
      setActiveNoteId(null);
      fetchDoctorData();
    } catch (err) { alert("Failed to save note."); }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: '#1b4332' }}>Welcome, Dr. {name}</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>Daily Patient Schedule & Clinic Overview</p>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f1f8f5', textAlign: 'left' }}>
            <tr>
              <th style={{ padding: '15px' }}>Patient</th>
              <th style={{ padding: '15px' }}>Service</th>
              <th style={{ padding: '15px' }}>Time Slot</th>
              <th style={{ padding: '15px' }}>Medical Note</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(app => (
              <tr key={app._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}>Patient #{app.userId.slice(-4)}</td>
                <td style={{ padding: '15px' }}>{app.service}</td>
                <td style={{ padding: '15px', fontWeight: 'bold', color: primaryGreen }}>{app.time}</td>
                <td style={{ padding: '15px' }}>
                  {activeNoteId === app._id ? (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <input 
                        type="text" 
                        value={tempNote} 
                        onChange={(e) => setTempNote(e.target.value)} 
                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
                      />
                      <button onClick={() => handleSaveNote(app._id)} style={{ backgroundColor: primaryGreen, color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                    </div>
                  ) : (
                    <span 
                      onClick={() => { setActiveNoteId(app._id); setTempNote(app.doctorNote || ''); }} 
                      style={{ color: primaryGreen, cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' }}
                    >
                      {app.doctorNote ? 'Edit Note' : 'Add Note'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorDashboard;