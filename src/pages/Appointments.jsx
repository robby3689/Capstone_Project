import { Link } from "react-router-dom";

export default function Appointments() {
  return (
    <div>
      <h2>PREVIOUS APPOINTMENTS</h2>

      <ul>
        <li>Feb 10 — 2:00 PM</li>
        <li>Jan 10 — 11:00 AM</li>
        <li>Jan 4 — 12:30 PM</li>
      </ul>

      <Link to="/book">
        <button>Book Appointment</button>
      </Link>
    </div>
  );
}
