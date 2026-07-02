import { useCallback, useEffect, useState } from "react";
import { Heart, X, RotateCcw } from "lucide-react";
import { Avatar } from "../components/Avatar";
import { TaskIcon, TASK_LABELS } from "../components/TaskIcon";
import { getColorForId, getInitials } from "../lib/avatar";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import type { MatchCandidate, TaskType } from "../types";

type Direction = "like" | "pass" | null;

interface CandidateRow {
  id: string;
  type: TaskType;
  title: string;
  time_window: string;
  poster: { id: string; name: string } | { id: string; name: string }[];
}

function normalizeCandidate(row: CandidateRow): MatchCandidate {
  const poster = Array.isArray(row.poster) ? row.poster[0] : row.poster;
  return {
    taskId: row.id,
    poster: { id: poster.id, name: poster.name },
    task: { type: row.type, title: row.title, timeWindow: row.time_window },
  };
}

export function Match() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<MatchCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [lastAction, setLastAction] = useState<Direction>(null);
  const [matched, setMatched] = useState<string | null>(null);

  const loadCandidates = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("id, type, title, time_window, poster:profiles(id, name)")
      .neq("poster_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      setError(error.message);
    } else {
      setError(null);
      setCandidates((data as CandidateRow[]).map(normalizeCandidate));
      setIndex(0);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const candidate = candidates[index];
  const isDone = index >= candidates.length;

  const handleAction = async (direction: Direction) => {
    if (!candidate || !user) return;
    setLastAction(direction);

    if (direction === "like") {
      const { error } = await supabase.from("matches").insert({
        task_id: candidate.taskId,
        user_a: user.id,
        user_b: candidate.poster.id,
        status: "matched",
      });
      if (error) {
        setError(error.message);
      } else {
        setMatched(candidate.poster.name);
        setTimeout(() => setMatched(null), 1800);
      }
    }

    setTimeout(() => {
      setLastAction(null);
      setIndex((i) => i + 1);
    }, 180);
  };

  return (
    <div className="screen">
      <header className="screen__header">
        <div>
          <h1>Find a task buddy</h1>
          <p className="screen__subtitle">Accept to match, pass to see who's next</p>
        </div>
      </header>

      {error && <p className="auth-message auth-message--error task-list__error">{error}</p>}

      <div className="match-stage">
        {matched && (
          <div className="match-toast">
            <Heart size={18} fill="#e76f51" color="#e76f51" /> It's a match with {matched}!
          </div>
        )}

        {loading ? (
          <p className="screen__subtitle">Loading task buddies...</p>
        ) : !isDone && candidate ? (
          <div className={`match-card ${lastAction ? `match-card--${lastAction}` : ""}`}>
            <div
              className="match-card__photo"
              style={{ backgroundColor: getColorForId(candidate.poster.id) }}
            >
              <span>{getInitials(candidate.poster.name)}</span>
            </div>
            <div className="match-card__info">
              <h2>{candidate.poster.name}</h2>
              <div className="match-card__task">
                <div className="match-card__task-icon">
                  <TaskIcon type={candidate.task.type} size={18} />
                </div>
                <div>
                  <span className="task-card__type">{TASK_LABELS[candidate.task.type]}</span>
                  <p className="match-card__task-title">{candidate.task.title}</p>
                  <p className="match-card__task-time">{candidate.task.timeWindow}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="match-empty">
            <Avatar color="#264653" initials="✓" size={56} />
            <h2>You're all caught up</h2>
            <p>No more task buddies nearby right now. Check back soon.</p>
            <button className="btn btn--secondary" onClick={loadCandidates}>
              <RotateCcw size={16} /> Refresh
            </button>
          </div>
        )}
      </div>

      {!loading && !isDone && candidate && (
        <div className="match-actions">
          <button
            className="match-actions__btn match-actions__btn--pass"
            onClick={() => handleAction("pass")}
            aria-label="Pass"
          >
            <X size={26} />
          </button>
          <button
            className="match-actions__btn match-actions__btn--like"
            onClick={() => handleAction("like")}
            aria-label="Like"
          >
            <Heart size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
