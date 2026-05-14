import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function TaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function loadTask() {
    const data = await apiFetch(`/tasks/${taskId}`);
    setTask(data);
    setTitle(data.title);
    setDescription(data.description);
  }

  useEffect(() => {
    loadTask();
  }, [taskId]);

  function startEditing() {
    setTitle(task.title);
    setDescription(task.description);
    setIsEditing(true);
  }

  function cancelEditing() {
    setTitle(task.title);
    setDescription(task.description);
    setIsEditing(false);
  }

  async function handleUpdate(e) {
    e.preventDefault();

    const updatedTask = await apiFetch(`/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({
        title,
        description,
      }),
    });

    setTask(updatedTask);
    setIsEditing(false);
  }

  async function deleteTask() {
    alert("Do you really want to delete this task?");
    await apiFetch(`/tasks/${taskId}`, {
      method: "DELETE",
    });
    navigate("/tasks");
  }

  if (!task) return <p>Loading...</p>;

  return (
    <div>
      {!isEditing ? (
        <div className="rounded-xl bg-slate-50 p-6 shadow-sm">
          <h2 className="mb-3 text-3xl font-bold">{task.title}</h2>
          <p className="mb-6 text-slate-600">{task.description}</p>

          <div className="flex gap-3">
            <button
              className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white"
              onClick={startEditing}
            >
              Edit
            </button>
            <button
              className="rounded-md bg-red-500 px-4 py-2 font-medium text-white"
              onClick={deleteTask}
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="mb-5 text-3xl font-bold">
              Edit Task
          </h2>

          <form
            className="space-y-5"
            onSubmit={handleUpdate}
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                rows="5"
                className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-5 py-2 font-medium text-white hover:bg-slate-700"
              >
                Save
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-300 bg-white px-5 py-2 font-medium text-slate-700 hover:bg-slate-100"
                onClick={cancelEditing}
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
      <br />
      <Link 
        className="mt-6 inline-block font-medium text-slate-600 no-underline hover:text-slate-950"
        to={`/tasks`}>
          Back
      </Link>
    </div>
  );
}