import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { saveToken } from "../auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setIsLoggedIn } = useOutletContext();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const data = await response.json();
    saveToken(data.access_token);
    setIsLoggedIn(true);
    navigate("/tasks");
  }

  return (
    <div>
      <h2>Login</h2>
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
        <button type="submit">Login</button>
      </form>
      <p>
        New to Todo 1? <Link to="/register">Sign Up</Link>
      </p>
    </div>
  )
}