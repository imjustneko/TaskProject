// shell.jsx — Sidebar, Topbar, navigation chrome

function Sidebar({ route, setRoute, onCompose, onStatus, dark, setDark }) {
  const navMain = [
    { key: 'dashboard', label: 'Home',         icon: 'home' },
    { key: 'today',     label: 'Today',        icon: 'sun',      badge: 4 },
    { key: 'plans',     label: 'Plans',        icon: 'calendar' },
    { key: 'friends',   label: 'Friends',      icon: 'users',    badge: 2 },
    { key: 'profile',   label: 'Profile',      icon: 'edit' },
  ];

  return (
    <aside className="side">
      <div className="side-brand">
        <div className="side-brand-mark">T</div>
        <span>Taskyy</span>
      </div>

      <button className="btn btn-accent btn-sm" style={{ margin: '4px 4px 14px', justifyContent: 'flex-start', height: 32, paddingLeft: 10 }} onClick={onCompose}>
        <Icon name="plus" size={14} />
        New task
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
          <span className="kbd" style={{ background: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.85)' }}>N</span>
        </span>
      </button>

      <div className="side-section">Personal</div>
      {navMain.map((n) => (
        <button key={n.key} className="side-link" data-active={route.name === n.key ? '1' : '0'} onClick={() => setRoute({ name: n.key })}>
          <Icon name={n.icon} size={15} />
          <span>{n.label}</span>
          {n.badge && <span className="side-link-badge">{n.badge}</span>}
        </button>
      ))}

      <div className="side-section row" style={{ justifyContent: 'space-between' }}>
        <span>Rooms</span>
        <Icon name="plus" size={12} style={{ color: 'var(--text-faint)', cursor: 'default' }} />
      </div>
      {ROOMS.map((r) => (
        <button key={r.id} className="side-link" data-active={route.name === 'room' && route.id === r.id ? '1' : '0'} onClick={() => setRoute({ name: 'room', id: r.id })}>
          <span style={{ width: 15, textAlign: 'center', fontSize: 13 }}>{r.emoji}</span>
          <span className="truncate">{r.name}</span>
          {r.activeNow.length > 0 && (
            <span style={{
              marginLeft: 'auto',
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--status-online)',
              boxShadow: '0 0 0 3px color-mix(in oklab, var(--status-online) 22%, transparent)',
            }} />
          )}
        </button>
      ))}

      <div className="side-foot">
        <div className="side-me" onClick={onStatus}>
          <Avatar user={ME} size={30} status onBg="subtle" />
          <div className="flex1 truncate">
            <div className="side-me-name truncate">{ME.name}</div>
            <div className="side-me-status truncate">{ME.status.emoji} {ME.status.label}</div>
          </div>
          <Icon name="chevron-right" size={14} style={{ color: 'var(--text-faint)' }} />
        </div>
      </div>
    </aside>
  );
}

function Topbar({ title, crumb, children, onSearch, onToggleTheme, dark }) {
  return (
    <div className="topbar">
      <div className="row gap-2">
        <span className="topbar-title">{title}</span>
        {crumb && <span className="topbar-crumb">/ {crumb}</span>}
      </div>
      <div className="topbar-spacer" />
      <div className="row gap-2">
        {children}
        <div className="input-search" style={{ width: 220 }}>
          <Icon name="search" size={14} />
          <input className="input" placeholder="Search…" style={{ height: 32, fontSize: 13 }} onChange={onSearch} />
        </div>
        <Button variant="ghost" size="sm" icon="bell" />
        <Button variant="ghost" size="sm" icon={dark ? 'sun' : 'sun'} onClick={onToggleTheme} title="Toggle theme" />
      </div>
    </div>
  );
}

// ── Page header (within view) ─────────────────────────────────────────────
function PageHeader({ title, subtitle, eyebrow, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 28 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {eyebrow && <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 6 }}>{eyebrow}</div>}
        <h1>{title}</h1>
        {subtitle && <div style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 14 }}>{subtitle}</div>}
      </div>
      <div className="row gap-2">{children}</div>
    </div>
  );
}

Object.assign(window, { Sidebar, Topbar, PageHeader });
