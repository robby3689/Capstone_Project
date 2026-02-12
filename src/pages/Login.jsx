import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div style={styles.page}>
      <h2>LOGIN</h2>

      <label style={styles.label}>EMAIL</label>
      <input placeholder="Enter your email" style={styles.input} />

      <label style={styles.label}>PASSWORD</label>
      <input type="password" placeholder="Enter your password" style={styles.input} />

      <button style={styles.button}>SUBMIT</button>

      <p style={styles.linkText}>
        <Link to="/register">Create your account</Link>
      </p>
    </div>
  );
}

const styles = {
  page: { maxWidth: 420, margin: "60px auto", textAlign: "center" },
  label: { display: "block", marginTop: 16, fontSize: 12 },
  input: { width: "100%", padding: 10, marginTop: 6, background: "#eee", border: "1px solid #ddd" },
  button: { marginTop: 18, padding: "10px 18px", background: "#22a6f2", border: "none", cursor: "pointer" },
  linkText: { marginTop: 14, fontSize: 12 }
};
