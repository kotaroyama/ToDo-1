import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function TaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    apiFetch(`/tasks/${taskId}`).then(setTask);
  }, [taskId]);

  if (!task) return <p>Loading...</p>;

  return (
    <div>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <p>{task.completed ? "Completed" : "Not completed"}</p>
      <Link to={`/tasks`}>Back</Link>
    </div>
  );
}