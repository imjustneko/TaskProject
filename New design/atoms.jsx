// atoms.jsx — Shared low-level components & icons

// ── Icon set (stroke-based, 18px default) ──────────────────────────────────
function Icon({ name, size = 16, color = "currentColor", style }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style,
  };
  switch (name) {
    case 'home':     return <svg {...props}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-4v-6h-8v6H4a1 1 0 0 1-1-1z"/></svg>;
    case 'sun':      return <svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>;
    case 'calendar': return <svg {...props}><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></svg>;
    case 'users':    return <svg {...props}><circle cx="9" cy="9" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 11a3 3 0 1 0 0-6M22 20a5 5 0 0 0-4.5-5"/></svg>;
    case 'room':     return <svg {...props}><path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>;
    case 'hash':     return <svg {...props}><path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16"/></svg>;
    case 'check':    return <svg {...props}><path d="m4 12 5 5L20 6"/></svg>;
    case 'plus':     return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'search':   return <svg {...props}><circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5"/></svg>;
    case 'bell':     return <svg {...props}><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2.5h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>;
    case 'send':     return <svg {...props}><path d="m4 12 16-8-6 18-3-7-7-3z"/></svg>;
    case 'image':    return <svg {...props}><rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m4 18 5-5 4 4 3-3 4 4"/></svg>;
    case 'paperclip':return <svg {...props}><path d="M20 12 12 20a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8"/></svg>;
    case 'sparkle':  return <svg {...props}><path d="M12 4v6M12 14v6M4 12h6M14 12h6M6 6l4 4M14 14l4 4M18 6l-4 4M10 14l-4 4"/></svg>;
    case 'more':     return <svg {...props}><circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/></svg>;
    case 'edit':     return <svg {...props}><path d="m4 20 4-1 11-11-3-3L5 16l-1 4z"/></svg>;
    case 'settings': return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.65 1.65 0 0 0-1.8-.3 1.65 1.65 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.65 1.65 0 0 0-1-1.5 1.65 1.65 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.65 1.65 0 0 0 .3-1.8 1.65 1.65 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.65 1.65 0 0 0 1.5-1 1.65 1.65 0 0 0-.3-1.8L4.2 7a2 2 0 1 1 2.8-2.8l.1.1a1.65 1.65 0 0 0 1.8.3H9a1.65 1.65 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.65 1.65 0 0 0 1 1.5 1.65 1.65 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.65 1.65 0 0 0-.3 1.8V9a1.65 1.65 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.65 1.65 0 0 0-1.5 1z"/></svg>;
    case 'flag':     return <svg {...props}><path d="M5 21V4M5 5h11l-1.5 3.5L16 12H5"/></svg>;
    case 'clock':    return <svg {...props}><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg>;
    case 'chevron-right': return <svg {...props}><path d="m9 6 6 6-6 6"/></svg>;
    case 'chevron-down':  return <svg {...props}><path d="m6 9 6 6 6-6"/></svg>;
    case 'x':        return <svg {...props}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    case 'logout':   return <svg {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>;
    case 'inbox':    return <svg {...props}><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5 2 12v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7l-3.5-7z"/></svg>;
    case 'archive':  return <svg {...props}><rect x="2.5" y="4.5" width="19" height="5" rx="1"/><path d="M4 9.5V20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9.5M9 13h6"/></svg>;
    case 'lock':     return <svg {...props}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>;
    case 'globe':    return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case 'eye':      return <svg {...props}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'arrow-right': return <svg {...props}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case 'rocket':   return <svg {...props}><path d="M14 4s5 0 6 1 1 6 1 6-3.5 5-7.5 6.5l-3-3C12 10.5 17 7 14 4z"/><path d="M9 15s-3 1-4 3 1 3 1 3 2-1 3-4M14 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>;
    case 'chart':     return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V9M12 17v-5M15 17v-8"/></svg>;
    case 'tag':       return <svg {...props}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
    case 'handshake': return <svg {...props}><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l1.06 1.06L12 21.23l7.77-7.94 1.06-1.06a5.4 5.4 0 0 0-.41-7.65z"/></svg>;
    default: return null;
  }
}

// ── Button ─────────────────────────────────────────────────────────────────
function Button({ variant = 'default', size = 'md', icon, iconRight, children, ...rest }) {
  const cls = ['btn'];
  if (variant === 'primary') cls.push('btn-primary');
  if (variant === 'accent')  cls.push('btn-accent');
  if (variant === 'ghost')   cls.push('btn-ghost');
  if (size === 'sm') cls.push('btn-sm');
  if (size === 'lg') cls.push('btn-lg');
  if (!children) cls.push('btn-icon');
  return (
    <button className={cls.join(' ')} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 13 : 15} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'sm' ? 13 : 15} />}
    </button>
  );
}

// ── Avatar ─────────────────────────────────────────────────────────────────
function Avatar({ user, size = 32, status = false, onBg }) {
  if (!user) return null;
  const bg = hueFor(user.name);
  const initials = user.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  const presence = user.presence || user.status?.presence;
  return (
    <div className="avatar" data-on-bg={onBg} style={{ width: size, height: size, fontSize: Math.max(10, size * 0.38) }}>
      <div className="avatar-inner" style={{ background: bg }}>{initials}</div>
      {status && presence && <span className="avatar-status" data-s={presence} />}
    </div>
  );
}

// ── Badge ──────────────────────────────────────────────────────────────────
function Badge({ tone, children, dot }) {
  return (
    <span className="badge" data-tone={tone}>
      {dot && <i className="dot" />}
      {children}
    </span>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, width }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" style={width ? { width } : undefined} onClick={(e) => e.stopPropagation()}>
        <div className="modal-hd">
          <h2>{title}</h2>
          <Button variant="ghost" size="sm" icon="x" onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────
// Variant: 'inline' (compact, inside list/card) | 'page' (large, illustrative)
function Empty({ icon = 'sparkle', title, hint, action, variant = 'page' }) {
  if (variant === 'inline') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 8, padding: '24px 16px', color: 'var(--text-muted)', textAlign: 'center',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, display: 'grid', placeItems: 'center',
          background: 'var(--bg-subtle)', color: 'var(--text-muted)',
          border: '1px solid var(--border)',
        }}>
          <Icon name={icon} size={18} />
        </div>
        <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13 }}>{title}</div>
        {hint && <div style={{ fontSize: 12, maxWidth: 280, lineHeight: 1.45 }}>{hint}</div>}
        {action && <div style={{ marginTop: 2 }}>{action}</div>}
      </div>
    );
  }
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 14, padding: '56px 24px', color: 'var(--text-muted)', textAlign: 'center',
    }}>
      {/* Illustrative mark with gentle glow */}
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        <div style={{
          position: 'absolute', inset: -10, borderRadius: 28,
          background: 'radial-gradient(circle at center, var(--accent-tint), transparent 70%)',
          opacity: 0.7,
        }} />
        <div style={{
          position: 'relative', width: 80, height: 80, borderRadius: 22,
          display: 'grid', placeItems: 'center',
          background: 'linear-gradient(145deg, var(--bg-elevated), var(--bg-subtle))',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-2)',
          color: 'var(--text-soft)',
        }}>
          <Icon name={icon} size={32} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', marginTop: 4 }}>
        <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 15, letterSpacing: '-0.005em' }}>{title}</div>
        {hint && <div style={{ fontSize: 13, maxWidth: 360, lineHeight: 1.55 }}>{hint}</div>}
      </div>
      {action && <div style={{ marginTop: 6 }}>{action}</div>}
    </div>
  );
}

// ── Progress bar ───────────────────────────────────────────────────────────
function Progress({ value, height = 4, tone = 'accent', label }) {
  const color = tone === 'accent' ? 'var(--accent)' : tone === 'soft' ? 'var(--text-muted)' : 'var(--text)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--text-muted)' }}>
          <span>{label}</span>
          <span className="mono">{value}%</span>
        </div>
      )}
      <div style={{
        height, borderRadius: 999, background: 'var(--bg-subtle)',
        border: '1px solid var(--border)', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${value}%`, background: color,
          transition: 'width 400ms var(--ease-out)',
        }} />
      </div>
    </div>
  );
}

// ── Status pill ────────────────────────────────────────────────────────────
function StatusPill({ status, compact = false }) {
  if (!status) return <span className="muted" style={{ fontSize: 12 }}>—</span>;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: compact ? '2px 8px' : '3px 10px',
      borderRadius: 999, fontSize: compact ? 11.5 : 12.5,
      background: 'var(--bg-subtle)', color: 'var(--text-soft)',
      border: '1px solid var(--border)',
    }}>
      <span style={{ fontSize: 13 }}>{status.emoji}</span>
      <span>{status.label}</span>
    </span>
  );
}

// ── Priority dot ───────────────────────────────────────────────────────────
function PriorityDot({ level }) {
  const colors = { high: 'var(--status-busy)', med: 'var(--status-idle)', low: 'var(--text-faint)' };
  const titles = { high: 'High', med: 'Medium', low: 'Low' };
  return (
    <span title={titles[level]} style={{
      width: 8, height: 8, borderRadius: 2,
      background: colors[level], flexShrink: 0,
    }} />
  );
}

// ── Category tag ───────────────────────────────────────────────────────────
function CategoryTag({ category }) {
  const c = CATEGORIES.find(c => c.key === category);
  if (!c) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '1px 7px 1px 6px', borderRadius: 5, fontSize: 11,
      fontWeight: 500, color: 'var(--text-soft)',
      background: 'var(--bg-subtle)', border: '1px solid var(--border)',
    }}>
      <i style={{ width: 6, height: 6, borderRadius: 2, background: c.color }} />
      {category}
    </span>
  );
}

// ── Member stack ───────────────────────────────────────────────────────────
function MemberStack({ ids, size = 22, max = 4 }) {
  const list = ids.slice(0, max);
  const extra = ids.length - list.length;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      {list.map((id, i) => (
        <div key={id} style={{ marginLeft: i === 0 ? 0 : -6, boxShadow: '0 0 0 2px var(--bg-elevated)', borderRadius: '50%' }}>
          <Avatar user={getUser(id)} size={size} />
        </div>
      ))}
      {extra > 0 && (
        <div style={{
          marginLeft: -6, width: size, height: size, borderRadius: '50%',
          background: 'var(--bg-subtle)', border: '1px solid var(--border)',
          display: 'grid', placeItems: 'center',
          fontSize: 10.5, fontWeight: 600, color: 'var(--text-muted)',
          boxShadow: '0 0 0 2px var(--bg-elevated)',
        }}>+{extra}</div>
      )}
    </div>
  );
}

Object.assign(window, {
  Icon, Button, Avatar, Badge, Modal, Empty, Progress, StatusPill, PriorityDot,
  CategoryTag, MemberStack,
});
