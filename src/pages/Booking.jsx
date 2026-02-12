import { useState } from "react";
import { Link } from "react-router-dom";

export default function Booking() {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    setMessage("Appointment request submitted (demo).");
  };

  return (
    <div>
      <h2>BOOK APPOINTMENT</h2>

      <label>Date</label>
      <br />
      <input type="date" />
      <br /><br />

      <label>Time</label>
      <br />
      <input type="time" />
      <br /><br />

      <label>Doctor</label>
      <br />
      <select>
        <option>Dr. John Doe</option>
        <option>Dr. Sarah Smith</option>
      </select>
      <br /><br />

      <button onClick={handleSubmit}>Request</button>

      {message && <p>{message}</p>}

      <p>
        <Link to="/appointments">Check previous appointments</Link>
      </p>
    </div>
  );
}
