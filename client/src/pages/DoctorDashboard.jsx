import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const name = localStorage.getItem('name');
  const token = localStorage.getItem('token');
  const primaryGreen = '#27ae60';
  const darkGreen = '#1b4332';
  const dangerRed = '#e74c3c';

  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      const appntRes = await axios.get('http://localhost:5000/api/appointments/all', config);
      const reportRes = await axios.get('http://localhost:5000/api/reports/all', config);
      setAppointments(appntRes.data);
      setReports(reportRes.data);
    } catch (err) { console.error("Fetch failed", err); }
  };

  const handleUpload = async (app) => {
    const patientId = app.userId?._id || app.userId; 
    if (!selectedFile) return alert("Please select a PDF file first");
    if (!patientId) return alert("Error: This appointment has no valid Patient ID.");

    const formData = new FormData();
    formData.append('report', selectedFile); 
    formData.append('patientId', patientId);
    formData.append('doctorName', name);

    setUploading(true);
    try {
      await axios.post('http://localhost:5000/api/reports/upload', formData, {
        headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
      });
      alert("Upload Successful!");
      setSelectedFile(null);
      fetchDoctorData();
    } catch (err) { alert("Upload failed."); }
    setUploading(false);
  };

  const deleteAppointment = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await axios.delete(`http://localhost:5000/api/appointments/cancel/${id}`, config);
        setAppointments(appointments.filter(app => app._id !== id));
        alert("Appointment deleted.");
      } catch (err) { alert("Failed to delete appointment."); }
    }
  };

  const deleteReport = async (id) => {
    if (window.confirm("Delete this medical record permanently?")) {
      try {
        await axios.delete(`http://localhost:5000/api/reports/${id}`, config);
        setReports(reports.filter(r => r._id !== id));
        alert("Report deleted.");
      } catch (err) { alert("Delete failed."); }
    }
  };

  const tableHeaderStyle = { backgroundColor: '#f1f8f5', color: darkGreen, padding: '15px', textAlign: 'left', borderBottom: `2px solid ${primaryGreen}` };
  const cellStyle = { padding: '15px', borderBottom: '1px solid #eee', fontSize: '14px' };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', minHeight: '90vh' }}>
      <h2 style={{ color: darkGreen }}>Clinical Portal: Dr. {name}</h2>
      
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden', marginBottom: '40px' }}>
        <h3 style={{ padding: '20px', margin: 0, color: darkGreen }}>Upcoming Consultations</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Patient Name</th>
              <th style={tableHeaderStyle}>Service</th>
              <th style={tableHeaderStyle}>Date/Time</th>
              <th style={tableHeaderStyle}>Upload PDF</th>
              <th style={tableHeaderStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(app => (
              <tr key={app._id}>
                <td style={cellStyle}><strong>{app.userId?.name || "Patient"}</strong></td>
                <td style={cellStyle}>{app.service}</td>
                <td style={cellStyle}>{app.date} @ {app.time}</td>
                <td style={cellStyle}>
                  <input type="file" accept=".pdf" onChange={(e) => setSelectedFile(e.target.files[0])} style={{ fontSize: '11px' }} />
                  <button onClick={() => handleUpload(app)} disabled={uploading} style={{ backgroundColor: primaryGreen, color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Upload</button>
                </td>
                <td style={cellStyle}>
                  <button onClick={() => deleteAppointment(app._id)} style={{ color: dangerRed, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Cancel Appt</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <h3 style={{ padding: '20px', margin: 0, color: darkGreen }}>Manage Uploaded Reports</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>File Name</th>
              <th style={tableHeaderStyle}>Uploaded Date</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report._id}>
                <td style={cellStyle}>{report.fileName}</td>
                <td style={cellStyle}>{new Date(report.createdAt).toLocaleDateString()}</td>
                <td style={cellStyle}>
                  <a href={`http://localhost:5000/${report.filePath}`} target="_blank" rel="noreferrer" style={{ color: primaryGreen, marginRight: '15px', fontWeight: 'bold', textDecoration: 'none' }}>Download</a>
                  <button onClick={() => deleteReport(report._id)} style={{ color: dangerRed, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
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