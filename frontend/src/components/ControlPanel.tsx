import { useState } from "react";

type Mode = "random" | "ddos";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ControlPanel() {
  const [mode, setMode]       = useState<Mode>("random");
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);

  const start = async () => {
    setLoading(true);
    try {
      await fetch(`${API}/simulation/start?mode=${mode}`, { method: "POST" });
      setRunning(true);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const stop = async () => {
    setLoading(true);
    try {
      await fetch(`${API}/simulation/stop`, { method: "POST" });
      setRunning(false);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const btn: React.CSSProperties = {
    fontFamily: "var(--font)", fontSize: 11, fontWeight: 500,
    padding: "4px 14px", cursor: "pointer",
    border: "1px solid var(--border2)",
    background: "transparent", color: "var(--sub)",
    letterSpacing: 1, transition: "all 0.1s",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>

      {/* Mode selector */}
      <div style={{ display: "flex", border: "1px solid var(--border)", background: "var(--bg)" }}>
        {(["random", "ddos"] as Mode[]).map(m => (
          <button
            key={m}
            disabled={running}
            onClick={() => setMode(m)}
            style={{
              ...btn,
              border: "none",
              borderRight: m === "random" ? "1px solid var(--border)" : "none",
              background: mode === m
                ? (m === "ddos" ? "var(--red-dim)" : "var(--bg3)")
                : "transparent",
              color: mode === m
                ? (m === "ddos" ? "var(--red)" : "var(--bright)")
                : "var(--muted)",
              cursor: running ? "not-allowed" : "pointer",
            }}
          >
            {m === "ddos" ? "DDOS" : "RANDOM"}
          </button>
        ))}
      </div>

      {/* Start / Stop */}
      {!running ? (
        <button
          onClick={start}
          disabled={loading}
          style={{
            ...btn,
            borderColor: "var(--green)",
            color: "var(--green)",
            background: "var(--green-dim)",
            minWidth: 90,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#1f4a26")}
          onMouseLeave={e => (e.currentTarget.style.background = "var(--green-dim)")}
        >
          {loading ? "..." : "▶  START"}
        </button>
      ) : (
        <button
          onClick={stop}
          disabled={loading}
          style={{
            ...btn,
            borderColor: "var(--red)",
            color: "var(--red)",
            background: "var(--red-dim)",
            minWidth: 90,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#4d1a1a")}
          onMouseLeave={e => (e.currentTarget.style.background = "var(--red-dim)")}
        >
          {loading ? "..." : "■  STOP"}
        </button>
      )}

      {/* Status pill */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "4px 10px",
        border: "1px solid var(--border)",
        background: "var(--bg)",
        color: running
          ? (mode === "ddos" ? "var(--red)" : "var(--green)")
          : "var(--muted)",
        fontSize: 10, letterSpacing: 1.5,
      }}>
        <span style={{
          width: 5, height: 5, borderRadius: "50%",
          background: running
            ? (mode === "ddos" ? "var(--red)" : "var(--green)")
            : "var(--dim)",
          boxShadow: running
            ? (mode === "ddos" ? "0 0 6px var(--red)" : "0 0 6px var(--green)")
            : "none",
          display: "inline-block",
        }} />
        {running ? (mode === "ddos" ? "DDOS ACTIVE" : "STREAMING") : "IDLE"}
      </div>
    </div>
  );
}