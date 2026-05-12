import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";
import { getToken } from "../auth";

export default function Tasks() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  async function loadTasks() {
    const data = await apiFetch("/tasks?completed=false");
    setTasks(data);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const token = getToken();
  
    try {
      const response = await apiFetch('/tasks', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Task submission failed");
      }

    } catch (err) {
      setError(err.message);
    }

    setTitle("");
    setDescription("");
    await loadTasks();
  }

  async function completeTask(id) {
    const updated = await apiFetch(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ completed: true }),
    });
    setTasks(tasks.map((task) => (task.id === id ? updated : task)));
    await loadTasks();
  }

  async function deleteTask() {
    await apiFetch(`/tasks/${taskId}`, { method: "DELETE" });
    nativate("/tasks");
  }

  return (
    <div>
      <h1>Tasks</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description - Optional"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <br />
      {tasks.toReversed().map((task) => (
        <div key={task.id}>
          {!task.completed && (
            <div className="task-row">
              <form onClick={() => completeTask(task.id)}>
                <input type="checkbox" id="complete" value="complete" />
              </form>
              <Link to={`/tasks/${task.id}`} className="task-link">
                {task.title}
              </Link>
              <button onClick={deleteTask}>Delete</button>
            </div>
          )}
          <br />
        </div>
      ))}
    </div>
  );
}