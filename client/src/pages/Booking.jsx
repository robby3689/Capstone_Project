import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; // Connects to Render

const Booking = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [service, setService] = useState('General Consultation');
  const [isClosed, setIsClosed] = useState(false); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const darkGreen = '#1b4332';
  const primaryGreen = '#27ae60';

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", 
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", 
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"
  ];

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    const day = new Date(selectedDate).getUTCDay();
    setIsClosed(day === 0); 
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!time) return alert("Please select a time slot");
    if (isClosed) return alert("Clinic is closed on Sundays.");
    
    setLoading(true);
    const userId = localStorage.getItem('userId');

    try {
      await API.post('/appointments/book', {
        userId,
        date,
        time,
        service
      });
      alert("Appointment successfully scheduled!");
      navigate('/dashboard');
    } catch (err) {
      alert("Error: Could not save booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = { maxWidth: '1000px', margin: '40px auto', padding: '0 20px', display: 'flex', gap: '40px', alignItems: 'flex-start', minHeight: '70vh' };
  const cardStyle = { flex: 1, backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderTop: `6px solid ${isClosed ? '#e74c3c' : primaryGreen}` };
  const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '600', color: darkGreen };
  const inputStyle = { width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '15px' };

  return (
    <div style={containerStyle}>
      <div style={{ flex: 0.8 }}>
        <h1 style={{ color: darkGreen, fontSize: '32px', marginBottom: '15px' }}>Schedule Your Visit</h1>
        <p style={{ color: '#52796f', lineHeight: '1.6', fontSize: '16px' }}>
          Select your preferred service and time. Our specialists at Evergreen Clinic Highbury 
          are ready to provide you with the best care possible.
        </p>
        
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f1f8f5', borderRadius: '12px', border: `1px solid ${primaryGreen}` }}>
          <h4 style={{ color: darkGreen, margin: '0 0 10px 0' }}>Clinic Policy</h4>
          <ul style={{ color: '#2d6a4f', fontSize: '14px', paddingLeft: '20px', margin: 0 }}>
            <li>24-hour cancellation notice required.</li>
            <li>Please arrive 10 minutes before your slot.</li>
            <li>Closed on Sundays for facility maintenance.</li>
          </ul>
        </div>
      </div>

      <div style={cardStyle}>
        <form onSubmit={handleBooking}>
          <label style={labelStyle}>Select Date</label>
          <input type="date" style={inputStyle} value={date} onChange={handleDateChange} required />
          {isClosed && <p style={{ color: '#e74c3c', fontSize: '13px', marginTop: '-15px', marginBottom: '15px' }}>Clinic is closed on Sundays</p>}

          <label style={labelStyle}>Select Time Slot</label>
          <select style={inputStyle} value={time} onChange={(e) => setTime(e.target.value)} required disabled={isClosed}>
            <option value="">-- Choose a Time --</option>
            {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
          </select>

          <label style={labelStyle}>Service Type</label>
          <select style={inputStyle} value={service} onChange={(e) => setService(e.target.value)} disabled={isClosed}>
            <option value="General Consultation">General Consultation</option>
            <option value="Physical Exam">Physical Exam</option>
            <option value="Blood Work / Lab">Blood Work / Lab</option>
            <option value="Pediatric Care">Pediatric Care</option>
            <option value="Vaccination">Vaccination</option>
          </select>

          <button 
            type="submit" 
            disabled={isClosed || loading}
            style={{ 
              width: '100%', padding: '14px', 
              backgroundColor: isClosed || loading ? '#ccc' : primaryGreen, 
              color: 'white', border: 'none', borderRadius: '8px', 
              cursor: isClosed || loading ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold', fontSize: '16px' 
            }}
          >
            {loading ? 'Processing...' : isClosed ? 'Clinic Closed' : 'Confirm Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;