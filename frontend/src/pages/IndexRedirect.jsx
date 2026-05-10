import { Navigate } from "react-router-dom";
import { getToken } from "../auth";

export default function IndexRedirect() {
    const isLoggedIn = Boolean(getToken());

    return isLoggedIn ? (
      <Navigate to="/tasks" replace />
    ) : (
      <Navigate to="/login" replace />
    );
}