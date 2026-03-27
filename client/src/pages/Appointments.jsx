import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Appointments = () => {
  const [history, setHistory] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`[https://evergreen-clinic-backend.onrender.com](https://evergreen-clinic-backend.onrender.com)/api/appointments/user/${userId}`);
        setHistory(res.data);
      } catch (err) {
        console.log("Error loading history");
      }
    };
    fetchHistory();
  }, [userId]);

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Appointment History</h2>
        <Link to="/book">
          <button style={{ padding: '10px 15px', cursor: 'pointer', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '4px' }}>
            + Book New
          </button>
        </Link>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        {history.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>No previous records found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '12px' }}>Service</th>
                <th style={{ padding: '12px' }}>Date</th>
                <th style={{ padding: '12px' }}>Time</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((app) => (
                <tr key={app._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{app.service}</td>
                  <td style={{ padding: '12px' }}>{new Date(app.date).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>{app.time}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '12px', 
                      backgroundColor: '#e8f5e9', 
                      color: '#2e7d32' 
                    }}>
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link to="/home" style={{ color: '#2c3e50', textDecoration: 'none' }}>← Back to Home</Link>
      </div>
    </div>
  );
};

export default Appointments;