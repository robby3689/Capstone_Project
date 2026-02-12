import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div>
      <h2>REGISTER</h2>

      <label>Name</label>
      <br />
      <input placeholder="Enter your name" />
      <br /><br />

      <label>Email</label>
      <br />
      <input placeholder="Enter your email" />
      <br /><br />

      <label>Password</label>
      <br />
      <input type="password" placeholder="Enter your password" />
      <br /><br />

      <label>Confirm Password</label>
      <br />
      <input type="password" placeholder="Confirm password" />
      <br /><br />

      <button>Register</button>

      <p><Link to="/">Login</Link>
      </p>
    </div>
  );
}
