import type { Task } from "../types";
import { TaskIcon, TASK_LABELS } from "./TaskIcon";
import { Avatar } from "./Avatar";
import { MapPin, Clock } from "lucide-react";

export function TaskCard({ task }: { task: Task }) {
  return (
    <article className="task-card">
      <div className="task-card__icon">
        <TaskIcon type={task.type} size={22} />
      </div>
      <div className="task-card__body">
        <span className="task-card__type">{TASK_LABELS[task.type]}</span>
        <h3 className="task-card__title">{task.title}</h3>
        <p className="task-card__note">{task.note}</p>
        <div className="task-card__meta">
          <span>
            <Clock size={14} /> {task.timeWindow}
          </span>
          <span>
            <MapPin size={14} /> {task.distance}
          </span>
        </div>
      </div>
      <div className="task-card__poster">
        <Avatar color={task.poster.photoColor} initials={task.poster.initials} size={34} />
        <span>{task.poster.name}</span>
      </div>
    </article>
  );
}
