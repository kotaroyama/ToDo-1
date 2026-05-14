import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { getToken, logout } from "./auth";

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
    <div className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900">
      <div className="mx-auto max-w-xl">
        <nav className="mb-6 flex items-center gap-3 text-sm">
          {isLoggedIn ? (
            <>
              <Link className="font-medium text-slate-700 hover:text-slate-950" to="/">
                Home
              </Link>
              <span className="text-slate-300">|</span>
              <button
                className="font-medium text-slate-700 hover:text-slate-950"
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
              <Link className="font-medium text-slate-700 hover:text-slate-950" to="/login">
                Login
              </Link>
              <span className="text-slate-300">|</span>
              <Link className="font-medium text-slate-700 hover:text-slate-950" to="/register">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
      <main className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Todo 1</h1>
        <p className="mt-3 text-slate-600">
            A simple demo frontend for your FastAPI backend API.
        </p>
      </main>
      <Outlet context={{ setIsLoggedIn }} />
    </div>
  );
}