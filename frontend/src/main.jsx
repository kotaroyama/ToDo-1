import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import TaskDetail from "./pages/TaskDetail";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  { 
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <p>Welcome. Login or register to manage tasks.</p> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register />},
      {
        path: "tasks",
        element: (
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        ),
      },
      {
        path: "tasks/:taskId",
        element: (
          <ProtectedRoute>
            <TaskDetail />
          </ProtectedRoute>
        ),
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
)
