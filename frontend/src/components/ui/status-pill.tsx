interface StatusData {
  emoji?: string;
  label?: string;
  type?: string;
  customText?: string;
}

interface StatusPillProps {
  status?: StatusData | null;
  compact?: boolean;
}

export function StatusPill({ status, compact = false }: StatusPillProps) {
  if (!status) {
    return <span className="muted" style={{ fontSize: 12 }}>—</span>;
  }
  const label = status.customText ?? status.label ?? status.type ?? "";
  const emoji = status.emoji ?? "";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: compact ? "2px 8px" : "3px 10px",
        borderRadius: 999,
        fontSize: compact ? 11.5 : 12.5,
        background: "var(--bg-subtle)",
        color: "var(--text-soft)",
        border: "1px solid var(--border)",
      }}
    >
      {emoji && <span style={{ fontSize: 13 }}>{emoji}</span>}
      <span>{label}</span>
    </span>
  );
}
