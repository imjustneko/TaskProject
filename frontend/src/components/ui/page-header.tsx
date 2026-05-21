interface PageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, eyebrow, children }: PageHeaderProps) {
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:16, marginBottom:28 }}>
      <div style={{ flex:1, minWidth:0 }}>
        {eyebrow && (
          <div style={{
            fontSize: 11.5,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--text-faint)",
            marginBottom: 6,
          }}>
            {eyebrow}
          </div>
        )}
        <h1 style={{ marginBottom: subtitle ? 6 : 0 }}>{title}</h1>
        {subtitle && (
          <div style={{ color:"var(--text-muted)", fontSize:14, lineHeight:1.5 }}>
            {subtitle}
          </div>
        )}
      </div>
      {children && (
        <div className="row gap-2" style={{ flexShrink:0 }}>{children}</div>
      )}
    </div>
  );
}
