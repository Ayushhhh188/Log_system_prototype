type Props = {
  label: string;
  value: string | number;
  accent?: "green" | "amber" | "red" | "blue" | "dim";
  unit?: string;
};

const ACCENT_COLOR: Record<string, string> = {
  green: "var(--green)",
  amber: "var(--amber)",
  red:   "var(--red)",
  blue:  "var(--blue)",
  dim:   "var(--sub)",
};

export default function StatsCard({ label, value, accent = "dim", unit }: Props) {
  const color = ACCENT_COLOR[accent];
  return (
    <div style={{
      borderRight: "1px solid var(--border)",
      padding: "10px 18px",
      display: "flex", flexDirection: "column", gap: 3,
      minWidth: 110,
    }}>
      <span style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 2, textTransform: "uppercase" }}>
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontSize: 20, fontWeight: 600, color, letterSpacing: -1, lineHeight: 1 }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 1 }}>{unit}</span>
        )}
      </div>
    </div>
  );
}