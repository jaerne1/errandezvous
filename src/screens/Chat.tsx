import { useState } from "react";
import { Send, Check } from "lucide-react";
import { chatMessages, checklist as initialChecklist, matchedPerson } from "../data/mockData";
import type { ChatMessage, ChecklistItem } from "../types";
import { Avatar } from "../components/Avatar";

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessages);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);
  const [draft, setDraft] = useState("");

  const toggleItem = (id: string) => {
    setChecklist((items) =>
      items.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages((msgs) => [
      ...msgs,
      {
        id: `msg${Date.now()}`,
        sender: "me",
        text: draft.trim(),
        time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      },
    ]);
    setDraft("");
  };

  return (
    <div className="screen screen--chat">
      <header className="chat-header">
        <Avatar color={matchedPerson.photoColor} initials={matchedPerson.initials} size={38} />
        <div>
          <h2>{matchedPerson.name}</h2>
          <p>{matchedPerson.taskTitle}</p>
        </div>
      </header>

      <div className="checklist">
        <span className="checklist__title">Shared checklist</span>
        <div className="checklist__items">
          {checklist.map((item) => (
            <button
              key={item.id}
              className={`checklist__item ${item.done ? "checklist__item--done" : ""}`}
              onClick={() => toggleItem(item.id)}
            >
              <span className="checklist__checkbox">{item.done && <Check size={12} strokeWidth={3} />}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="chat-thread">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble-row ${msg.sender === "me" ? "chat-bubble-row--me" : ""}`}>
            <div className={`chat-bubble ${msg.sender === "me" ? "chat-bubble--me" : ""}`}>
              <p>{msg.text}</p>
              <span className="chat-bubble__time">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      <form className="chat-input" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Message Riley..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit" className="icon-btn icon-btn--accent" aria-label="Send">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
