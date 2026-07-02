import { ListChecks, Heart, MessageCircle, MapPin } from "lucide-react";

export type Tab = "feed" | "match" | "chat" | "checkin";

const TABS: { id: Tab; label: string; icon: typeof Heart }[] = [
  { id: "feed", label: "Tasks", icon: ListChecks },
  { id: "match", label: "Match", icon: Heart },
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "checkin", label: "Check-in", icon: MapPin },
];

export function BottomNav({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={`bottom-nav__item ${active === id ? "bottom-nav__item--active" : ""}`}
          onClick={() => onChange(id)}
        >
          <Icon size={22} strokeWidth={active === id ? 2.4 : 1.8} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
