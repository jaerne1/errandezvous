export type TaskType = "grocery" | "dryClean" | "doctor" | "errand" | "pharmacy" | "petStore";

export interface Task {
  id: string;
  type: TaskType;
  title: string;
  timeWindow: string;
  distance: string;
  note: string;
  poster: {
    name: string;
    photoColor: string;
    initials: string;
  };
}

export interface MatchCandidate {
  id: string;
  name: string;
  age: number;
  photoColor: string;
  initials: string;
  bio: string;
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
  sender: "me" | "them";
  text: string;
  time: string;
}
