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
    await apiFetch(`/tasks/${taskId}`, {
      method: "DELETE",
    });
    navigate("/tasks");
  }

  if (!task) return <p>Loading...</p>;

  return (
    <div>
      {!isEditing ? (
        <>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
          <button onClick={startEditing}>Edit</button>
          <button onClick={deleteTask}>Delete</button>
        </>
      ) : (
        <form onSubmit={handleUpdate}>
          <div>
            <label>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button type="submit">Save</button>
          <button type="button" onClick={cancelEditing}>
            Cancel
          </button>
        </form>
      )}
      <br />
      <Link to={`/tasks`}>Back</Link>
    </div>
  );
}