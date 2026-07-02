export type TaskType = "grocery" | "dryClean" | "doctor" | "errand" | "pharmacy" | "petStore";

export interface Profile {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  type: TaskType;
  title: string;
  location: string;
  timeWindow: string;
  note: string | null;
  createdAt: string;
  poster: Profile;
}

export interface MatchCandidate {
  taskId: string;
  poster: Profile;
  task: {
    type: TaskType;
    title: string;
    timeWindow: string;
  };
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface ChatMessage {
  id: string;
  matchId: string;
  senderId: string;
  body: string;
  createdAt: string;
}

export interface ActiveMatch {
  id: string;
  taskTitle: string;
  otherUser: Profile;
}
