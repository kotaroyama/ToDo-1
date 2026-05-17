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
        if (response.status == 400) {
          throw new Error("Username already exists");
        } 
        throw new Error("Registration failed");
      }
      setStatus(true);
      setTimeout(() => {
        setStatus(false);
        navigate("/login"); 
      }, 1000) 
    } catch (err) {
        setError(err.message);
        setUsername("");
        setPassword("");
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-xl bg-slate-50 p-6 shadow-sm">
      <h2 className="mb-5 text-center text-2xl font-bold">Register</h2>
      <form
        className="space-y-3"
        onSubmit={handleSubmit}
      >
        <input
          className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full rounded-md bg-slate-900 py-3 font-medium text-white hover:bg-slate-700"
          type="submit"
        >
          Register
        </button>
      </form>
      {error && <p>{error}</p>}
      {status ? (
        <div>
          <h3>Sign up successful!</h3>
          <p>Redirecting to login page...</p>
        </div>
      ) : (
        <div className="mt-6 text-center text-sm text-slate-600">
          <p>
            Already have an acccount?{" "}
            <Link
              className="font-semibold text-slate-900 no-underline hover:underline"
              to="/login">
                Login
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}