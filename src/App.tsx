import { useState } from "react";
import { LogOut } from "lucide-react";
import { BottomNav, type Tab } from "./components/BottomNav";
import { TaskFeed } from "./screens/TaskFeed";
import { Match } from "./screens/Match";
import { Chat } from "./screens/Chat";
import { CheckIn } from "./screens/CheckIn";
import { AuthScreen } from "./screens/AuthScreen";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AuthedApp() {
  const [tab, setTab] = useState<Tab>("feed");
  const { signOut } = useAuth();

  return (
    <div className="app-shell">
      <button className="icon-btn app-shell__signout" onClick={signOut} aria-label="Log out">
        <LogOut size={16} />
      </button>
      <div className="app-content">
        {tab === "feed" && <TaskFeed />}
        {tab === "match" && <Match />}
        {tab === "chat" && <Chat />}
        {tab === "checkin" && <CheckIn />}
      </div>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

function Gate() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-shell">
        <p className="screen__subtitle task-list__status">Loading...</p>
      </div>
    );
  }

  return session ? <AuthedApp /> : <div className="app-shell"><AuthScreen /></div>;
}

function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}

export default App;
