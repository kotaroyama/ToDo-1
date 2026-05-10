import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    apiFetch("/tasks?completed=false").then(setTasks);
  }, []);

  async function completeTask(id) {
    const updated = await apiFetch(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ completed: true }),
    });
    setTasks(tasks.map((task) => (task.id === id ? updated : task)));
  }

  return (
    <div>
      <h1>Tasks</h1>

      {tasks.map((task) => (
        <div key={task.id}>
          <Link to={`/tasks/${task.id}`}>{task.title}</Link>
          <p>{task.description}</p>
          <p>{task.completed ? "Completed" : "Not completed"}</p>
          {!task.completed && (
            <button onClick={() => completeTask(task.id)}>Complete</button>
          )}
          <br />
          <br />
        </div>
      ))}
    </div>
  );
}