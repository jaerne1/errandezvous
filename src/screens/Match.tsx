import { useState } from "react";
import { Heart, X, RotateCcw } from "lucide-react";
import { matchCandidates } from "../data/mockData";
import { Avatar } from "../components/Avatar";
import { TaskIcon, TASK_LABELS } from "../components/TaskIcon";

type Direction = "like" | "pass" | null;

export function Match() {
  const [index, setIndex] = useState(0);
  const [lastAction, setLastAction] = useState<Direction>(null);
  const [matched, setMatched] = useState<string | null>(null);

  const candidate = matchCandidates[index];
  const isDone = index >= matchCandidates.length;

  const handleAction = (direction: Direction) => {
    if (!candidate) return;
    setLastAction(direction);
    if (direction === "like") {
      setMatched(candidate.name);
      setTimeout(() => setMatched(null), 1800);
    }
    setTimeout(() => {
      setLastAction(null);
      setIndex((i) => i + 1);
    }, 180);
  };

  const reset = () => {
    setIndex(0);
    setLastAction(null);
  };

  return (
    <div className="screen">
      <header className="screen__header">
        <div>
          <h1>Find a task buddy</h1>
          <p className="screen__subtitle">Accept to match, pass to see who's next</p>
        </div>
      </header>

      <div className="match-stage">
        {matched && (
          <div className="match-toast">
            <Heart size={18} fill="#e76f51" color="#e76f51" /> It's a match with {matched}!
          </div>
        )}

        {!isDone && candidate ? (
          <div className={`match-card ${lastAction ? `match-card--${lastAction}` : ""}`}>
            <div className="match-card__photo" style={{ backgroundColor: candidate.photoColor }}>
              <span>{candidate.initials}</span>
            </div>
            <div className="match-card__info">
              <h2>
                {candidate.name}, {candidate.age}
              </h2>
              <p className="match-card__bio">{candidate.bio}</p>
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
            <button className="btn btn--secondary" onClick={reset}>
              <RotateCcw size={16} /> Start over
            </button>
          </div>
        )}
      </div>

      {!isDone && candidate && (
        <div className="match-actions">
          <button className="match-actions__btn match-actions__btn--pass" onClick={() => handleAction("pass")} aria-label="Pass">
            <X size={26} />
          </button>
          <button className="match-actions__btn match-actions__btn--like" onClick={() => handleAction("like")} aria-label="Like">
            <Heart size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
