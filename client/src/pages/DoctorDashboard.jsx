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
      const appntRes = await axios.get('https://evergreen-clinic-backend.onrender.com/api/appointments/all', config);
      const reportRes = await axios.get('https://evergreen-clinic-backend.onrender.com/api/reports/all', config);
      setAppointments(Array.isArray(appntRes.data) ? appntRes.data : []);
      setReports(Array.isArray(reportRes.data) ? reportRes.data : []);
    } catch (err) { console.error("Fetch failed", err); }
  };

  const handleUpload = async (app) => {
    const patientId = app.userId?._id || app.userId; 
    if (!selectedFile) return alert("Select a PDF file");
    const formData = new FormData();
    formData.append('report', selectedFile); 
    formData.append('patientId', patientId);
    formData.append('doctorName', name);

    setUploading(true);
    try {
      await axios.post('https://evergreen-clinic-backend.onrender.com/api/reports/upload', formData, {
        headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
      });
      alert("Success!");
      fetchDoctorData();
    } catch (err) { alert("Failed."); }
    setUploading(false);
  };

  const deleteAppointment = async (id) => {
    if (window.confirm("Delete?")) {
      try {
        await axios.delete(`https://evergreen-clinic-backend.onrender.com/api/appointments/cancel/${id}`, config);
        setAppointments(appointments.filter(a => a._id !== id));
      } catch (err) { alert("Failed."); }
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: darkGreen }}>Clinical Portal: Dr. {name}</h2>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f8f5' }}>
              <th style={{ padding: '15px', textAlign: 'left' }}>Patient Name</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Service</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(app => (
              <tr key={app._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}>{app.userId?.name || "Patient"}</td>
                <td style={{ padding: '15px' }}>{app.service}</td>
                <td style={{ padding: '15px' }}>
                   <input type="file" accept=".pdf" onChange={(e) => setSelectedFile(e.target.files[0])} />
                   <button onClick={() => handleUpload(app)} style={{ backgroundColor: primaryGreen, color: 'white', padding: '5px' }}>Upload</button>
                   <button onClick={() => deleteAppointment(app._id)} style={{ color: dangerRed, marginLeft: '10px' }}>Cancel</button>
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