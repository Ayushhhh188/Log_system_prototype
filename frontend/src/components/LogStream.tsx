import { useEffect, useRef, useState, useCallback } from "react";
import { wsService, type LogEntry } from "../services/websocket";

type Stats = { total: number; anomalies: number; critical: number };
type LogStreamProps = { setStats: React.Dispatch<React.SetStateAction<Stats>> };
type Filter = "ALL" | "WARNING" | "ERROR";

const MAX_LOGS = 500;

const TYPE_COLOR: Record<string, string> = {
  normal:     "var(--green)",
  suspicious: "var(--amber)",
  critical:   "var(--red)",
};

const LEVEL_COLOR: Record<string, string> = {
  INFO:    "var(--blue)",
  WARNING: "var(--amber)",
  ERROR:   "var(--red)",
};

const TYPE_BG: Record<string, string> = {
  normal:     "transparent",
  suspicious: "rgba(210,153,34,0.04)",
  critical:   "rgba(248,81,73,0.06)",
};

const TYPE_BORDER: Record<string, string> = {
  normal:     "transparent",
  suspicious: "var(--amber-dim)",
  critical:   "var(--red-dim)",
};

export default function LogStream({ setStats }: LogStreamProps) {
  const [logs, setLogs]     = useState<LogEntry[]>([]);
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState<Filter>("ALL");
  const scrollRef  = useRef<HTMLDivElement>(null);
  const pausedRef  = useRef(false);
  pausedRef.current = paused;

  const handleLog = useCallback((log: LogEntry) => {
    if (pausedRef.current) return;
    setLogs(prev => {
      const next = [...prev, log];
      return next.length > MAX_LOGS ? next.slice(-MAX_LOGS) : next;
    });
    setStats(prev => ({
      total:     prev.total + 1,
      anomalies: log.type !== "normal" ? prev.anomalies + 1 : prev.anomalies,
      critical:  log.type === "critical" ? prev.critical + 1 : prev.critical,
    }));
  }, [setStats]);

  useEffect(() => {
    wsService.connect();
    wsService.onLog(handleLog);
    return () => wsService.offLog(handleLog);
  }, [handleLog]);

  useEffect(() => {
    if (!paused && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, paused]);

  const filtered = filter === "ALL" ? logs : logs.filter(l => l.level === filter);

  const btnStyle = (active: boolean, activeColor: string): React.CSSProperties => ({
    fontFamily: "var(--font)", fontSize: 10, letterSpacing: 1.5,
    padding: "3px 10px", cursor: "pointer", border: "1px solid",
    borderColor: active ? activeColor : "var(--border)",
    color: active ? activeColor : "var(--muted)",
    background: "transparent",
    transition: "all 0.1s",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>

      {/* Toolbar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "6px 12px",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg1)",
        flexShrink: 0,
        gap: 8, flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", gap: 4 }}>
          {(["ALL", "WARNING", "ERROR"] as Filter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={btnStyle(filter === f,
                f === "ERROR" ? "var(--red)" : f === "WARNING" ? "var(--amber)" : "var(--sub)"
              )}>
              {f}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 1 }}>
            {filtered.length} LINES
          </span>
          <button
            onClick={() => setPaused(p => !p)}
            style={btnStyle(paused, "var(--amber)")}
          >
            {paused ? "▶ RESUME" : "⏸ PAUSE"}
          </button>
          <button
            onClick={() => setLogs([])}
            style={btnStyle(false, "var(--sub)")}
          >
            CLR
          </button>
        </div>
      </div>

      {/* Log lines */}
      <div
        ref={scrollRef}
        style={{
          flex: 1, minHeight: 0,
          overflowY: "auto",
          background: "var(--bg)",
          padding: "4px 0",
        }}
      >
        {filtered.length === 0 ? (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            height: "100%", flexDirection: "column", gap: 8,
          }}>
            <div style={{ color: "var(--dim)", fontSize: 11, letterSpacing: 2 }}>
              NO ACTIVE STREAM
            </div>
            <div style={{ color: "var(--muted)", fontSize: 10 }}>
              START SIMULATION TO BEGIN LOG CAPTURE
            </div>
            <div style={{ marginTop: 8 }}>
              <span className="cursor" />
            </div>
          </div>
        ) : (
          filtered.map((log, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "148px 60px 200px 1fr",
                gap: 0,
                padding: "1px 12px",
                background: TYPE_BG[log.type],
                borderLeft: `2px solid ${TYPE_BORDER[log.type]}`,
                fontFamily: "var(--font)",
                fontSize: 11,
                lineHeight: "20px",
                whiteSpace: "nowrap",
              }}
            >
              {/* Timestamp */}
              <span style={{ color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis" }}>
                {log.timestamp}
              </span>

              {/* Level */}
              <span style={{
                color: LEVEL_COLOR[log.level] || "var(--text)",
                fontWeight: 500,
              }}>
                {log.level?.padEnd(7)}
              </span>

              {/* Component */}
              <span style={{
                color: "var(--sub)",
                overflow: "hidden", textOverflow: "ellipsis",
                paddingRight: 8,
              }}>
                {log.component}
              </span>

              {/* Message */}
              <span style={{
                color: TYPE_COLOR[log.type] === "var(--green)" ? "var(--text)" : TYPE_COLOR[log.type],
                overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}