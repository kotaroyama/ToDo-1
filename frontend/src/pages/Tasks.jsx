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

  return (
    <div>
      <h1>Tasks</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <br />
      {tasks.toReversed().map((task) => (
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