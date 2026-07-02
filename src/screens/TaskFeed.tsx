import { useState } from "react";
import { Plus } from "lucide-react";
import { tasks as initialTasks } from "../data/mockData";
import type { Task, TaskType } from "../types";
import { TaskCard } from "../components/TaskCard";
import { PostTaskModal } from "../components/PostTaskModal";

export function TaskFeed() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showModal, setShowModal] = useState(false);

  const handlePost = (data: { type: TaskType; location: string; time: string; note: string }) => {
    const newTask: Task = {
      id: `t${Date.now()}`,
      type: data.type,
      title: data.location,
      timeWindow: data.time,
      distance: "Near you",
      note: data.note || "No additional notes.",
      poster: { name: "You", photoColor: "#e76f51", initials: "Y" },
    };
    setTasks([newTask, ...tasks]);
    setShowModal(false);
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

      <div className="task-list">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {showModal && <PostTaskModal onClose={() => setShowModal(false)} onSubmit={handlePost} />}
    </div>
  );
}
