export default function Sidebar() {
  const nav = [
    { key: "DASH", label: "DASHBOARD", active: true },
    { key: "LOGS", label: "LOG STREAM", active: false },
    { key: "ANOM", label: "ANOMALIES", active: false },
    { key: "SIM",  label: "SIMULATION", active: false },
    { key: "CFG",  label: "CONFIG", active: false },
  ];

  return (
    <aside
      style={{
        width: 44,
        background: "var(--bg1)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 0",
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      {/* Logo mark */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <img
          src="/logo.png"
          alt="Logo"
          style={{
            width: 26,
            height: 26,
            objectFit: "contain",
            marginBottom: 16,
          }}
        />

        {nav.map((item) => (
          <button
            key={item.key}
            title={item.label}
            style={{
              width: 32,
              height: 32,
              background: item.active ? "var(--bg3)" : "transparent",
              border: item.active
                ? "1px solid var(--border2)"
                : "1px solid transparent",
              borderLeft: item.active
                ? "2px solid var(--green)"
                : "2px solid transparent",
              color: item.active ? "var(--green)" : "var(--muted)",
              fontSize: 8,
              fontWeight: 600,
              letterSpacing: 1,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.1s",
              fontFamily: "var(--font)",
            }}
            onMouseEnter={(e) => {
              if (!item.active)
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--sub)";
            }}
            onMouseLeave={(e) => {
              if (!item.active)
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--muted)";
            }}
          >
            {item.key}
          </button>
        ))}
      </div>

      {/* Bottom user */}
      <div
        style={{
          width: 26,
          height: 26,
          border: "1px solid var(--border2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--sub)",
          fontSize: 8,
          fontWeight: 600,
          cursor: "pointer",
        }}
        title="John Doe — Admin"
      >
        JD
      </div>
    </aside>
  );
}