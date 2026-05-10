import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed");
      }
      setStatus(true);
      setTimeout(() => {
        setStatus(false);
        navigate("/login"); 
      }, 1000) 
    } catch (err) {
        setError(err.message);
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      {error && <p>{error}</p>}
      {status ? (
        <div>
          <h3>Sign up successful!</h3>
          <p>Redirecting to login page...</p>
        </div>
      ) : (
        <div>
          <p>
            Already have an acccount? <Link to="/login">Login</Link>
          </p>
        </div>
      )}
    </div>
  );
}