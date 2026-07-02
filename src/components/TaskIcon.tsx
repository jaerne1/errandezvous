import { ShoppingCart, Shirt, Stethoscope, Pill, PawPrint, ClipboardList } from "lucide-react";
import type { TaskType } from "../types";

const ICONS: Record<TaskType, typeof ShoppingCart> = {
  grocery: ShoppingCart,
  dryClean: Shirt,
  doctor: Stethoscope,
  pharmacy: Pill,
  petStore: PawPrint,
  errand: ClipboardList,
};

export const TASK_LABELS: Record<TaskType, string> = {
  grocery: "Grocery run",
  dryClean: "Dry cleaner",
  doctor: "Doctor's visit",
  pharmacy: "Pharmacy",
  petStore: "Pet store",
  errand: "Errand",
};

export function TaskIcon({ type, size = 20 }: { type: TaskType; size?: number }) {
  const Icon = ICONS[type];
  return <Icon size={size} strokeWidth={2} />;
}
