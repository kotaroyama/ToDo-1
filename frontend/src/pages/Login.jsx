import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { saveToken } from "../auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
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

    if (response.ok) {
      const data = await response.json();
      saveToken(data.access_token);
      setIsLoggedIn(true);
      navigate("/tasks");
    } else {
      setLoginFailed(true);
      setTimeout(() => {
        setLoginFailed(false);
        navigate("/");
      }, 1500)   
    }
  }

  return (
    <div className="rounded-xl bg-slate-50 p-6 shadow-sm">
      <h2 className="mb-5 text-center text-2xl font-bold">Login</h2>
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
          Login
        </button>
      </form>
      {loginFailed ? (
        <div>
          <p>Username or Password Don't Match</p>
          <p>Redirecting</p>
        </div>
      ) : (
        <div className="mt-6 text-center text-sm text-slate-600">
          <p>
            New to Todo 1?{" "}
            <Link
              className="font-semibold text-slate-900 no-underline hover:underline"
              to="/register">
                Sign Up
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}