import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import type { Task, TaskType } from "../types";
import { TaskCard } from "../components/TaskCard";
import { PostTaskModal } from "../components/PostTaskModal";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

interface TaskRow {
  id: string;
  type: TaskType;
  title: string;
  location: string;
  time_window: string;
  note: string | null;
  created_at: string;
  poster: { id: string; name: string } | { id: string; name: string }[];
}

function normalizeTask(row: TaskRow): Task {
  const poster = Array.isArray(row.poster) ? row.poster[0] : row.poster;
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    location: row.location,
    timeWindow: row.time_window,
    note: row.note,
    createdAt: row.created_at,
    poster: { id: poster.id, name: poster.name },
  };
}

export function TaskFeed() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("id, type, title, location, time_window, note, created_at, poster:profiles(id, name)")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setError(null);
      setTasks((data as TaskRow[]).map(normalizeTask));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handlePost = async (data: { type: TaskType; location: string; time: string; note: string }) => {
    if (!user) return;
    const { error } = await supabase.from("tasks").insert({
      poster_id: user.id,
      type: data.type,
      title: data.location,
      location: data.location,
      time_window: data.time,
      note: data.note || null,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setShowModal(false);
    loadTasks();
  };

  return (
    <div className="screen">
      <header className="screen__header">
        <div>
          <h1>Nearby tasks</h1>
          <p className="screen__subtitle">Find company for your next errand</p>
        </div>
        <button className="btn btn--primary btn--pill" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Post a task
        </button>
      </header>

      {error && <p className="auth-message auth-message--error task-list__error">{error}</p>}

      {loading ? (
        <p className="screen__subtitle task-list__status">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="screen__subtitle task-list__status">
          No tasks posted yet. Be the first to post one!
        </p>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {showModal && <PostTaskModal onClose={() => setShowModal(false)} onSubmit={handlePost} />}
    </div>
  );
}
