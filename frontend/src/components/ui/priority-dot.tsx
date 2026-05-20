type PriorityLevel = "high" | "med" | "low" | "HIGH" | "MEDIUM" | "LOW" | "URGENT";

interface PriorityDotProps {
  level?: PriorityLevel | string;
}

function normalizeLevel(level?: string): "high" | "med" | "low" {
  if (!level) return "low";
  const l = level.toLowerCase();
  if (l === "high" || l === "urgent") return "high";
  if (l === "medium" || l === "med") return "med";
  return "low";
}

export function PriorityDot({ level }: PriorityDotProps) {
  const normalized = normalizeLevel(level);
  const colors: Record<string, string> = {
    high: "var(--status-busy)",
    med: "var(--status-idle)",
    low: "var(--text-faint)",
  };
  const titles: Record<string, string> = { high: "High", med: "Medium", low: "Low" };
  return (
    <span
      title={titles[normalized]}
      style={{
        width: 8,
        height: 8,
        borderRadius: 2,
        background: colors[normalized],
        flexShrink: 0,
        display: "inline-block",
      }}
    />
  );
}
