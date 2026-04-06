import { useState, useEffect, useCallback } from "react";
import { todoApi } from "./api/todoApi";
import { isLoggedIn, getAuth, clearAuth } from "./api/authApi";
import AuthPage from "./components/AuthPage";
import TodoItem from "./components/TodoItem";
import InstanceBadge from "./components/InstanceBadge";
import RequestLog from "./components/RequestLog";
import ServiceStatus from "./components/ServiceStatus";
import ActuatorPanel from "./components/ActuatorPanel";
let logCounter = 0;

export default function App() {
  const [authed, setAuthed] = useState(isLoggedIn());
  const [currentUser, setCurrentUser] = useState(getAuth().username || "");

  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [lastPort, setLastPort] = useState(null);
  const [error, setError] = useState(null);
  const [requestLogs, setRequestLogs] = useState([]);

  const addLog = useCallback((action, port) => {
    if (!port) return;
    const time = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setRequestLogs((prev) => [
      ...prev.slice(-49),
      { id: ++logCounter, action, port, time },
    ]);
  }, []);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await todoApi.getAll();
      const { todos: list, servedByPort } = res.data;
      setTodos(list || []);
      setLastPort(servedByPort);
      addLog("GET /todos", servedByPort);
    } catch {
      setError(
        "Cannot reach CLIENT-SERVICE. Make sure all services are running.",
      );
    } finally {
      setLoading(false);
    }
  }, [addLog]);

  useEffect(() => {
    if (authed) fetchTodos();
  }, [authed, fetchTodos]);

  const handleAuthSuccess = (username) => {
    setCurrentUser(username);
    setAuthed(true);
  };

  const handleLogout = () => {
    clearAuth();
    setAuthed(false);
    setCurrentUser("");
    setTodos([]);
    setRequestLogs([]);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const task = newTask.trim();
    if (!task) return;
    setAdding(true);
    setError(null);
    try {
      const res = await todoApi.create(task);
      const { todo, servedByPort } = res.data;
      setTodos((prev) => [...prev, todo]);
      setLastPort(servedByPort);
      addLog(
        `POST "${task.slice(0, 20)}${task.length > 20 ? "…" : ""}"`,
        servedByPort,
      );
      setNewTask("");
    } catch {
      setError("Failed to create todo.");
    } finally {
      setAdding(false);
    }
  };

  const handleUpdate = (data) => {
    const { todo, servedByPort } = data;
    setTodos((prev) => prev.map((t) => (t.id === todo.id ? todo : t)));
    setLastPort(servedByPort);
    addLog(`PUT /todos/${todo.id}`, servedByPort);
  };

  const handleDelete = (id, port) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    setLastPort(port);
    addLog(`DELETE /todos/${id}`, port);
  };

  // Show auth page if not logged in
  if (!authed) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">
                Todo Microservices
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                Spring Boot · Eureka · OpenFeign · Load Balancing
              </p>
            </div>
            <div className="flex items-center gap-3">
              {lastPort && (
                <InstanceBadge port={lastPort} label="todo-service" />
              )}
              {/* User info + logout */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-mono">
                  {currentUser}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-red-400
                             hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/20
                             transition-all duration-150"
                >
                  Sign out
                </button>
              </div>
              <button
                onClick={fetchTodos}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-zinc-400
                           hover:text-zinc-200 hover:bg-zinc-800 transition-all disabled:opacity-40"
              >
                <svg
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main todo panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card p-4">
              <form onSubmit={handleAdd} className="flex gap-3">
                <input
                  className="input-field"
                  type="text"
                  placeholder="Add a new task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  disabled={adding}
                />
                <button
                  type="submit"
                  className="btn-primary flex-shrink-0 flex items-center gap-2"
                  disabled={adding || !newTask.trim()}
                >
                  {adding ? (
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  )}
                  Add
                </button>
              </form>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
                {error}
              </div>
            )}

            <div className="glass-card overflow-hidden">
              <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-zinc-800/60">
                <h2 className="text-sm font-medium text-zinc-300">All Todos</h2>
                {todos.length > 0 && (
                  <span className="text-xs text-zinc-500 font-mono">
                    {completedCount}/{todos.length} done
                  </span>
                )}
              </div>

              {loading && !todos.length ? (
                <div className="flex items-center justify-center py-12 gap-3 text-zinc-500">
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="text-sm">Connecting to services…</span>
                </div>
              ) : todos.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-zinc-500 text-sm">
                    No todos yet. Add one above!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/40 px-1 py-1">
                  {todos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}

              {todos.length > 0 && (
                <div className="px-4 pb-4 pt-2 border-t border-zinc-800/40">
                  <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${(completedCount / todos.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <ServiceStatus lastPort={lastPort} />
            <ActuatorPanel />
            <RequestLog logs={requestLogs} />
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-zinc-700 font-mono">
          React → CLIENT-SERVICE :8080 → Feign → todo-service
          [:8081|:8082|:8083] → MySQL
        </p>
      </div>
    </div>
  );
}
