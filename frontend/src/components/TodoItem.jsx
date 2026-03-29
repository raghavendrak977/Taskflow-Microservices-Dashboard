import { useState } from "react";
import { todoApi } from "../api/todoApi";

export default function TodoItem({ todo, onUpdate, onDelete }) {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [task, setTask] = useState(todo.task);

  // Toggle complete
  const toggleComplete = async () => {
    setLoading(true);
    try {
      const res = await todoApi.update(todo.id, {
        task: todo.task,
        completed: !todo.completed,
      });
      onUpdate(res.data);
    } finally {
      setLoading(false);
    }
  };

  // Save edited task
  const handleUpdate = async () => {
    if (!task.trim() || task === todo.task) return;

    setLoading(true);
    try {
      const res = await todoApi.update(todo.id, {
        task,
        completed: todo.completed,
      });
      onUpdate(res.data);
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  // Delete todo
  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await todoApi.delete(todo.id);
      onDelete(todo.id, res.data?.servedByPort);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 group rounded-xl hover:bg-zinc-800/40 transition">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={toggleComplete}
        disabled={loading || editing} // ✅ disabled while editing
        className="w-4 h-4 cursor-pointer"
      />

      {/* Task text / Edit input */}
      {editing ? (
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="flex-1 bg-zinc-800 px-2 py-1 rounded text-sm text-zinc-200 outline-none"
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 text-sm ${
            todo.completed ? "line-through text-zinc-500" : "text-zinc-200"
          }`}
        >
          {todo.task}
        </span>
      )}

      {/* ID */}
      <span className="text-xs font-mono text-zinc-600">#{todo.id}</span>

      {/* Buttons */}
      {editing ? (
        <button
          onClick={handleUpdate}
          disabled={task.trim() === todo.task} // ✅ disable if no change
          className="text-green-400 text-xs disabled:opacity-30"
        >
          Save
        </button>
      ) : (
        <button
          onClick={() => setEditing(true)}
          disabled={todo.completed} // ✅ disable if completed
          className={`text-blue-400 text-xs opacity-0 group-hover:opacity-100 transition
            ${todo.completed ? "opacity-30 cursor-not-allowed" : ""}`}
        >
          Edit
        </button>
      )}

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-red-400 text-xs opacity-0 group-hover:opacity-100 transition"
      >
        Delete
      </button>
    </div>
  );
}
