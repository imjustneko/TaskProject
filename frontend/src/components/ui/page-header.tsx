interface PageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, eyebrow, children }: PageHeaderProps) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 28 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {eyebrow && (
          <div
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--text-faint)",
              marginBottom: 6,
            }}
          >
            {eyebrow}
          </div>
        )}
        <h1>{title}</h1>
        {subtitle && (
          <div style={{ color: "var(--text-muted)", marginTop: 6, fontSize: 14 }}>
            {subtitle}
          </div>
        )}
      </div>
      {children && (
        <div className="row gap-2">{children}</div>
      )}
    </div>
  );
}
