interface PageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, eyebrow, children }: PageHeaderProps) {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:32 }}>
      <div style={{ flex:1, minWidth:0 }}>
        {eyebrow && (
          <div style={{
            fontSize:11,
            fontWeight:700,
            letterSpacing:"0.08em",
            textTransform:"uppercase",
            color:"var(--accent)",
            marginBottom:6,
            opacity:0.85,
          }}>
            {eyebrow}
          </div>
        )}
        <h1 style={{ marginBottom: subtitle ? 8 : 0, lineHeight:1.1 }}>{title}</h1>
        {subtitle && (
          <div style={{
            color:"var(--text-muted)",
            fontSize:14,
            lineHeight:1.5,
            maxWidth:560,
          }}>
            {subtitle}
          </div>
        )}
      </div>
      {children && (
        <div className="row gap-2" style={{ paddingTop:4, flexShrink:0 }}>{children}</div>
      )}
    </div>
  );
}
