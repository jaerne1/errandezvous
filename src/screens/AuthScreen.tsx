import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);

    const message =
      mode === "signup" ? await signUp(email, password, name) : await signIn(email, password);

    setSubmitting(false);

    if (message) {
      setError(message);
      return;
    }

    if (mode === "signup") {
      setNotice("Check your email to confirm your account, then log in.");
      setMode("login");
    }
  };

  return (
    <div className="screen auth-screen">
      <div className="auth-screen__header">
        <h1>Errandevous</h1>
        <p className="screen__subtitle">Make everyday life an adventure.</p>
      </div>

      <div className="auth-card">
        <div className="auth-tabs">
          <button
            className={`auth-tabs__btn ${mode === "login" ? "auth-tabs__btn--active" : ""}`}
            onClick={() => setMode("login")}
            type="button"
          >
            Log in
          </button>
          <button
            className={`auth-tabs__btn ${mode === "signup" ? "auth-tabs__btn--active" : ""}`}
            onClick={() => setMode("signup")}
            type="button"
          >
            Sign up
          </button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <label>
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              minLength={6}
              required
            />
          </label>

          {error && <p className="auth-message auth-message--error">{error}</p>}
          {notice && <p className="auth-message auth-message--notice">{notice}</p>}

          <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
            {submitting ? "Please wait..." : mode === "signup" ? "Create account" : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
