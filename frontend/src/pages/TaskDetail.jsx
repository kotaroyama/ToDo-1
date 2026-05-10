import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function TaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    apiFetch(`/tasks/${taskId}`).then(setTask);
  }, [taskId]);

  async function deleteTask() {
    await apiFetch(`/tasks/${taskId}`, { method: "DELETE" });
    nativate("/tasks");
  }

  if (!task) return <p>Loading...</p>;

  return (
    <div>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <p>{task.completed ? "Completed" : "Not completed"}</p>
      <button onClick={deleteTask}>Delete</button>
    </div>
  );
}