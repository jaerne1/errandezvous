import { useState } from "react";
import { BottomNav, type Tab } from "./components/BottomNav";
import { TaskFeed } from "./screens/TaskFeed";
import { Match } from "./screens/Match";
import { Chat } from "./screens/Chat";
import { CheckIn } from "./screens/CheckIn";

function App() {
  const [tab, setTab] = useState<Tab>("feed");

  return (
    <div className="app-shell">
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

export default App;
