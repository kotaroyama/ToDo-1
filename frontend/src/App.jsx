import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { getToken, logout } from "./auth";
import "./App.css";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(getToken()));

  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(Boolean(getToken()));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div>
      <nav>
        {isLoggedIn ? (
          <>
            <Link to="/">Home</Link>{" | "}
            <button
              onClick={() => {
                logout();
                setIsLoggedIn(false);
                navigate("/login");
              }} 
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>{" | "}
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
      <main>
        <h1>Todo 1</h1>
        <p>A simple demo frontend for your FastAPI backend API.</p>
      </main>
      <Outlet context={{ setIsLoggedIn }} />
    </div>
  );
}