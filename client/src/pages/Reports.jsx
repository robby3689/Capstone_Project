import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reports = () => {
  const [reports, setReports] = useState([]); 
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`https://evergreen-clinic-backend.onrender.com/api/reports/patient/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReports(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Reports fetch error:", err);
        setReports([]);
      }
    };
    if (userId) fetchReports();
  }, [userId, token]);

  return (
    <div style={{ padding: '40px' }}>
      <h2>My Medical Reports</h2>
      {reports.length > 0 ? (
        reports.map((report) => (
          <div key={report._id} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0' }}>
            {report.fileName}
          </div>
        ))
      ) : (
        <p>No reports found.</p>
      )}
    </div>
  );
};

export default Reports;