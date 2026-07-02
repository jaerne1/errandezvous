import { useState } from "react";
import { X } from "lucide-react";
import type { TaskType } from "../types";
import { TASK_LABELS } from "./TaskIcon";

interface Props {
  onClose: () => void;
  onSubmit: (data: { type: TaskType; location: string; time: string; note: string }) => void;
}

const TYPE_OPTIONS = Object.keys(TASK_LABELS) as TaskType[];

export function PostTaskModal({ onClose, onSubmit }: Props) {
  const [type, setType] = useState<TaskType>("grocery");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || !time.trim()) return;
    onSubmit({ type, location, time, note });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>Post a task</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <form className="modal__form" onSubmit={handleSubmit}>
          <label>
            Task type
            <select value={type} onChange={(e) => setType(e.target.value as TaskType)}>
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {TASK_LABELS[t]}
                </option>
              ))}
            </select>
          </label>
          <label>
            Location
            <input
              type="text"
              placeholder="e.g. Whole Foods on 5th Ave"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </label>
          <label>
            Time window
            <input
              type="text"
              placeholder="e.g. Today, 5:00 - 6:00 PM"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </label>
          <label>
            Short note
            <textarea
              placeholder="Anything your task buddy should know?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </label>
          <button type="submit" className="btn btn--primary btn--block">
            Post task
          </button>
        </form>
      </div>
    </div>
  );
}
