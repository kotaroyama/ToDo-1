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

  async function deleteTask(taskId) {
    await apiFetch(`/tasks/${taskId}`, { method: "DELETE" });
    await loadTasks();
  }

  return (
    <div className="mx-auto max-w-3xl rounded-xl bg-slate-50 p-5 shadow-sm">
      <h2 className="mb-5 text-center text-2xl font-bold">Tasks</h2>
      <form 
        className="mb-5 flex overflow-hidden rounded-md bg-white shadow-sm" 
        onSubmit={handleSubmit}
      >
        <input
          className="min-w-0 flex-1 px-4 py-3 outline-none placeholder:text-slate-400"
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="w-px bg-slate-200" />

        <input
          className="min-w-0 flex-1 bg-slate-50 px-5 py-4 text-slate-700 outline-none placeholder:text-slate-400"
          type="text"
          placeholder="Add description... (Optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          className="bg-slate-900 px-5 font-medium text-white hover:bg-slate-700"
          type="submit"
        >
          Add
        </button>
      </form>

      <div className="space-y-3">
        {tasks.toReversed().map((task) => (
          <div key={task.id} className="flex items-center gap-3">
            {!task.completed && (
              <div className="flex flex-1 items-center gap-3 rounded-md border border-slate-300 bg-white px-3 py-3">
                <form onClick={() => completeTask(task.id)}>
                  <input type="checkbox" id="complete" value="complete" className="h-5 w-5 rounded" />
                </form>
                <Link
                  className="text-base text-slate-900 no-underline hover:underline"
                  to={`/tasks/${task.id}`}
                >
                  {task.title}
                </Link>
                <button 
                  className="text-xl text-slate-500 hover:text-red-500"
                  onClick={() => deleteTask(task.id)}>
                    🗑
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}