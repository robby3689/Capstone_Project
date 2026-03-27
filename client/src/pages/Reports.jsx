import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  const canManage = role === 'Admin' || role === 'Doctor';

  const fetchReports = async () => {
    try {
      const res = await axios.get('[https://evergreen-clinic-backend.onrender.com](https://evergreen-clinic-backend.onrender.com)/api/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data);
    } catch (err) {
      console.error("Failed to fetch reports");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#1b4332' }}>Medical Reports & Documents</h2>
      
      {canManage && (
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Upload New Report</h3>
          <input type="file" accept=".pdf" />
          <button style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }}>
            Upload PDF
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gap: '15px' }}>
        {reports.length > 0 ? reports.map((report) => (
          <div key={report._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', borderLeft: '5px solid #27ae60' }}>
            <span>{report.name}</span>
            <div>
              <button style={{ marginRight: '10px', color: '#27ae60', background: 'none', border: 'none', cursor: 'pointer' }}>View/Download</button>
              
              {canManage && (
                <button style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
              )}
            </div>
          </div>
        )) : <p>No reports available.</p>}
      </div>
    </div>
  );
};

export default Reports;