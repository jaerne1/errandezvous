import { useCallback, useEffect, useState } from "react";
import { Send, Check } from "lucide-react";
import { Avatar } from "../components/Avatar";
import { getColorForId, getInitials } from "../lib/avatar";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import type { ActiveMatch, ChatMessage, ChecklistItem } from "../types";

interface MatchRow {
  id: string;
  user_a: string;
  user_b: string;
  task: { title: string } | { title: string }[];
  profileA: { id: string; name: string } | { id: string; name: string }[];
  profileB: { id: string; name: string } | { id: string; name: string }[];
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: "c1", label: "Milk", done: false },
  { id: "c2", label: "Eggs", done: false },
  { id: "c3", label: "Bread", done: false },
  { id: "c4", label: "Coffee beans", done: false },
];

export function Chat() {
  const { user } = useAuth();
  const [match, setMatch] = useState<ActiveMatch | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(DEFAULT_CHECKLIST);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMatch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("matches")
      .select(
        "id, user_a, user_b, task:tasks(title), profileA:profiles!matches_user_a_fkey(id, name), profileB:profiles!matches_user_b_fkey(id, name)"
      )
      .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (!data) {
      setMatch(null);
      setLoading(false);
      return;
    }

    const row = data as MatchRow;
    const task = Array.isArray(row.task) ? row.task[0] : row.task;
    const profileA = Array.isArray(row.profileA) ? row.profileA[0] : row.profileA;
    const profileB = Array.isArray(row.profileB) ? row.profileB[0] : row.profileB;
    const otherProfile = row.user_a === user.id ? profileB : profileA;

    setMatch({
      id: row.id,
      taskTitle: task?.title ?? "Shared task",
      otherUser: { id: otherProfile.id, name: otherProfile.name },
    });
    setError(null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadMatch();
  }, [loadMatch]);

  useEffect(() => {
    if (!match) return;

    supabase
      .from("messages")
      .select("id, match_id, sender_id, body, created_at")
      .eq("match_id", match.id)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          return;
        }
        setMessages(
          (data ?? []).map((m) => ({
            id: m.id,
            matchId: m.match_id,
            senderId: m.sender_id,
            body: m.body,
            createdAt: m.created_at,
          }))
        );
      });

    const channel = supabase
      .channel(`messages:${match.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `match_id=eq.${match.id}` },
        (payload) => {
          const m = payload.new as {
            id: string;
            match_id: string;
            sender_id: string;
            body: string;
            created_at: string;
          };
          setMessages((prev) =>
            prev.some((existing) => existing.id === m.id)
              ? prev
              : [
                  ...prev,
                  { id: m.id, matchId: m.match_id, senderId: m.sender_id, body: m.body, createdAt: m.created_at },
                ]
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [match]);

  const toggleItem = (id: string) => {
    setChecklist((items) =>
      items.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !match || !user) return;
    const body = draft.trim();
    setDraft("");
    const { error } = await supabase
      .from("messages")
      .insert({ match_id: match.id, sender_id: user.id, body });
    if (error) setError(error.message);
  };

  if (loading) {
    return (
      <div className="screen">
        <p className="screen__subtitle task-list__status">Loading chat...</p>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="screen">
        <header className="screen__header">
          <div>
            <h1>Chat</h1>
            <p className="screen__subtitle">No matches yet</p>
          </div>
        </header>
        <p className="screen__subtitle task-list__status">
          Head to the Match tab and like someone to start a conversation here.
        </p>
      </div>
    );
  }

  return (
    <div className="screen screen--chat">
      <header className="chat-header">
        <Avatar color={getColorForId(match.otherUser.id)} initials={getInitials(match.otherUser.name)} size={38} />
        <div>
          <h2>{match.otherUser.name}</h2>
          <p>{match.taskTitle}</p>
        </div>
      </header>

      {error && <p className="auth-message auth-message--error task-list__error">{error}</p>}

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
          <div
            key={msg.id}
            className={`chat-bubble-row ${msg.senderId === user?.id ? "chat-bubble-row--me" : ""}`}
          >
            <div className={`chat-bubble ${msg.senderId === user?.id ? "chat-bubble--me" : ""}`}>
              <p>{msg.body}</p>
              <span className="chat-bubble__time">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}
      </div>

      <form className="chat-input" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder={`Message ${match.otherUser.name.split(" ")[0]}...`}
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
