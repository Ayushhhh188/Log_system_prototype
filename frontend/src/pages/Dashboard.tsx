import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import ControlPanel from "../components/ControlPanel";
import LogStream from "../components/LogStream";
import StatsCard from "../components/StatsCard";

const recentAlerts = [
  { type: "critical",   msg: "Auth service timeout",        time: "00:01" },
  { type: "suspicious", msg: "High latency on node-03",     time: "00:07" },
  { type: "suspicious", msg: "Rate limit approaching 90%",  time: "00:12" },
  { type: "normal",     msg: "Backup snapshot created",     time: "00:18" },
  { type: "critical",   msg: "SSH brute-force detected",    time: "00:24" },
];

const METRICS = [
  { label: "CPU",    value: 32 },
  { label: "MEMORY", value: 58 },
  { label: "DISK",   value: 14 },
  { label: "NET",    value: 71 },
];

function useTime() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return t;
}

const TYPE_COLOR: Record<string, string> = {
  critical:   "var(--red)",
  suspicious: "var(--amber)",
  normal:     "var(--green)",
};

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, anomalies: 0, critical: 0 });
  const now = useTime();

  const anomalyRate = stats.total > 0
    ? ((stats.anomalies / stats.total) * 100).toFixed(1)
    : "0.0";

  return (
    <div style={{
      display: "flex", height: "100vh", width: "100vw",
      overflow: "hidden", background: "var(--bg)",
      fontFamily: "var(--font)",
    }}>
      <Sidebar />

      {/* Main */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, overflow: "hidden" }}>

        {/* ── Top status bar ── */}
        <div style={{
          display: "flex", alignItems: "center",
          height: 36, flexShrink: 0,
          borderBottom: "1px solid var(--border)",
          background: "var(--bg1)",
          padding: "0 16px",
          gap: 0,
        }}>
          {/* Title */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            paddingRight: 20, borderRight: "1px solid var(--border)",
            marginRight: 0,
          }}>
            <span style={{ color: "var(--green)", fontSize: 10, fontWeight: 600, letterSpacing: 2 }}>
              a n o m a l y z e
            </span>
            <span style={{ color: "var(--dim)", fontSize: 9 }}></span>
          </div>

          {/* Stats inline */}
          <StatsCard label="TOTAL"      value={stats.total}     accent="dim"   />
          <StatsCard label="ANOMALIES"  value={stats.anomalies} accent="amber" />
          <StatsCard label="CRITICAL"   value={stats.critical}  accent="red"   />
          <StatsCard label="ANOM RATE"  value={anomalyRate}     accent="amber" unit="%" />

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Clock */}
          <div style={{
            fontSize: 10, color: "var(--sub)", letterSpacing: 2,
            paddingLeft: 20, borderLeft: "1px solid var(--border)",
          }}>
            {now.toISOString().replace("T", " ").slice(0, 19)} UTC
          </div>

          {/* System status */}
          <div style={{
            marginLeft: 16, paddingLeft: 16,
            borderLeft: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 10, color: "var(--green)", letterSpacing: 1.5,
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "var(--green)",
              boxShadow: "0 0 6px var(--green)",
              display: "inline-block",
            }} />
            OPERATIONAL
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

          {/* Left: log stream */}
          <div style={{
            display: "flex", flexDirection: "column",
            flex: 1, minWidth: 0, minHeight: 0,
            borderRight: "1px solid var(--border)",
          }}>
            {/* Stream header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "8px 12px",
              borderBottom: "1px solid var(--border)",
              background: "var(--bg1)",
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 2 }}>
                  /SYS/STREAM/LIVE
                </span>
                <span style={{ color: "var(--dim)" }}>—</span>
                <ControlPanel />
              </div>
              <span style={{ fontSize: 9, color: "var(--dim)", letterSpacing: 1 }}>
                MAX 500 LINES
              </span>
            </div>

            {/* Column headers */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "148px 60px 200px 1fr",
              padding: "3px 12px",
              borderBottom: "1px solid var(--border)",
              background: "var(--bg2)",
              flexShrink: 0,
            }}>
              {["TIMESTAMP", "LEVEL", "COMPONENT", "MESSAGE"].map(h => (
                <span key={h} style={{ fontSize: 9, color: "var(--dim)", letterSpacing: 2 }}>{h}</span>
              ))}
            </div>

            {/* Actual stream */}
            <div style={{ flex: 1, minHeight: 0 }}>
              <LogStream setStats={setStats} />
            </div>
          </div>

          {/* Right panel */}
          <div style={{
            width: 260, flexShrink: 0,
            display: "flex", flexDirection: "column",
            background: "var(--bg1)",
            overflowY: "auto",
          }}>

            {/* Recent alerts */}
            <div style={{ borderBottom: "1px solid var(--border)", padding: "10px 14px 6px" }}>
              <div style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 2, marginBottom: 8 }}>
                RECENT ALERTS
              </div>
              {recentAlerts.map((a, i) => (
                <div key={i} style={{
                  display: "flex", gap: 8, padding: "4px 0",
                  borderBottom: i < recentAlerts.length - 1 ? "1px solid var(--border)" : "none",
                }}>
                  <span style={{
                    color: TYPE_COLOR[a.type],
                    fontSize: 10, fontWeight: 600,
                    minWidth: 8, paddingTop: 1,
                  }}>
                    {a.type === "critical" ? "●" : a.type === "suspicious" ? "◆" : "○"}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {a.msg}
                    </div>
                    <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 1 }}>
                      -{a.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* System metrics */}
            <div style={{ borderBottom: "1px solid var(--border)", padding: "10px 14px" }}>
              <div style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 2, marginBottom: 10 }}>
                SYSTEM METRICS
              </div>
              {METRICS.map(m => {
                const color = m.value > 80 ? "var(--red)" : m.value > 60 ? "var(--amber)" : "var(--green)";
                return (
                  <div key={m.label} style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 1 }}>{m.label}</span>
                      <span style={{ fontSize: 9, color }}>{m.value}%</span>
                    </div>
                    <div style={{ height: 2, background: "var(--bg3)", position: "relative" }}>
                      <div style={{
                        position: "absolute", left: 0, top: 0,
                        height: "100%", width: `${m.value}%`,
                        background: color,
                        transition: "width 0.5s",
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Anomaly breakdown */}
            <div style={{ borderBottom: "1px solid var(--border)", padding: "10px 14px" }}>
              <div style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 2, marginBottom: 10 }}>
                ANOMALY BREAKDOWN
              </div>
              {[
                { label: "CRITICAL",   color: "var(--red)",   count: stats.critical },
                { label: "SUSPICIOUS", color: "var(--amber)", count: stats.anomalies - stats.critical },
                { label: "NORMAL",     color: "var(--green)", count: stats.total - stats.anomalies },
              ].map(row => (
                <div key={row.label} style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: 6,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 6, height: 6, background: row.color, display: "inline-block" }} />
                    <span style={{ fontSize: 9, color: "var(--sub)", letterSpacing: 1 }}>{row.label}</span>
                  </div>
                  <span style={{ fontSize: 11, color: row.color, fontWeight: 600 }}>{row.count}</span>
                </div>
              ))}
            </div>

            {/* System health */}
            <div style={{ padding: "10px 14px" }}>
              <div style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 2, marginBottom: 8 }}>
                SYSTEM HEALTH
              </div>
              {[
                { svc: "API GATEWAY",   ok: true  },
                { svc: "AUTH SERVICE",  ok: true  },
                { svc: "DB PRIMARY",    ok: true  },
                { svc: "CACHE LAYER",   ok: true  },
                { svc: "LOG PIPELINE",  ok: true  },
              ].map(s => (
                <div key={s.svc} style={{
                  display: "flex", justifyContent: "space-between",
                  marginBottom: 4,
                }}>
                  <span style={{ fontSize: 9, color: "var(--sub)", letterSpacing: 1 }}>{s.svc}</span>
                  <span style={{ fontSize: 9, color: s.ok ? "var(--green)" : "var(--red)", letterSpacing: 1 }}>
                    {s.ok ? "OK" : "FAIL"}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          height: 22, flexShrink: 0,
          borderTop: "1px solid var(--border)",
          background: "var(--bg1)",
          display: "flex", alignItems: "center",
          padding: "0 16px", gap: 20,
          fontSize: 9, color: "var(--muted)", letterSpacing: 1,
        }}>
          <span>WS: ws://localhost:8000/ws/logs</span>
          <span style={{ color: "var(--border2)" }}>|</span>
          <span>USER: john.doe@admin</span>
          <span style={{ color: "var(--border2)" }}>|</span>
          <span>SESSION: ACTIVE</span>
          <div style={{ flex: 1 }} />
          <span>LOG-ANOMALY-DETECTION-SYSTEM © 2026</span>
        </div>

      </div>
    </div>
  );
}