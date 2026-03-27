import React, { useEffect, useState } from 'react';
import API from '../api';
import { API_BASE_URL } from '../api';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await API.get(`/reports/patient/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        try {
          const fallback = await API.get('/reports/all', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const allReports = Array.isArray(fallback?.data) ? fallback.data : [];
          setReports(allReports.filter((r) => String(r?.patientId) === String(userId)));
        } catch (innerErr) {
          console.error('Reports fetch error:', innerErr);
          setReports([]);
        }
      }
    };
    if (userId) fetchReports();
  }, [userId, token]);

  const getReportUrl = (report) => {
    const filePath = String(report?.filePath ?? '');
    if (filePath.startsWith('http')) return filePath;
    return `${API_BASE_URL.replace('/api', '')}/${filePath.replace(/\\/g, '/')}`;
  };

  return (
    <div style={{ padding: '40px' }}>
      <h2>My Medical Reports</h2>
      {reports.length > 0 ? (
        reports.map((report) => (
          <div key={report?._id} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{report?.fileName ?? 'Report'}</span>
            <span>
              <a href={getReportUrl(report)} target="_blank" rel="noreferrer" style={{ marginRight: '10px' }}>
                View
              </a>
              <a href={getReportUrl(report)} download>
                Download
              </a>
            </span>
          </div>
        ))
      ) : (
        <p>No reports found.</p>
      )}
    </div>
  );
};

export default Reports;