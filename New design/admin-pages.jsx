// admin-pages.jsx — Admin panel: shell, dashboard, users, reports

// ── Admin sidebar (replaces user sidebar in admin mode) ────────────────────
function AdminSidebar({ route, setRoute, onExit }) {
  const items = [
    { key: 'admin-dashboard', label: 'Overview',  icon: 'home' },
    { key: 'admin-users',     label: 'Users',     icon: 'users' },
    { key: 'admin-reports',   label: 'Reports',   icon: 'flag', badge: ADMIN_REPORTS.length },
    { key: 'admin-rooms',     label: 'Rooms',     icon: 'room' },
    { key: 'admin-content',   label: 'Content',   icon: 'archive' },
    { key: 'admin-settings',  label: 'Settings',  icon: 'settings' },
  ];

  return (
    <aside className="side" data-admin="1">
      <div className="side-brand">
        <div className="side-brand-mark" style={{ background: 'var(--text)', color: 'var(--bg-elevated)' }}>T</div>
        <span>Taskyy</span>
        <span style={{
          marginLeft: 'auto',
          fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: 'var(--text-muted)',
          padding: '2px 7px', border: '1px solid var(--border-strong)',
          borderRadius: 4,
        }}>Admin</span>
      </div>

      <div className="side-section">Manage</div>
      {items.map((n) => (
        <button key={n.key} className="side-link" data-active={route.name === n.key ? '1' : '0'} onClick={() => setRoute({ name: n.key })}>
          <Icon name={n.icon} size={15} />
          <span>{n.label}</span>
          {n.badge ? <span className="side-link-badge" style={{ background: 'var(--status-busy)' }}>{n.badge}</span> : null}
        </button>
      ))}

      <div className="side-foot">
        <button className="side-link" onClick={onExit} style={{ color: 'var(--text-muted)' }}>
          <Icon name="logout" size={15} />
          <span>Exit admin</span>
        </button>
      </div>
    </aside>
  );
}

// ── Small chart components ────────────────────────────────────────────────
function Sparkline({ data, height = 36, color = 'var(--accent)', fill = true }) {
  const w = 100; const h = height;
  const min = Math.min(...data); const max = Math.max(...data);
  const rng = Math.max(1, max - min);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / rng) * (h - 6) - 3;
    return [x, y];
  });
  const path = 'M ' + pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(' L ');
  const fillPath = path + ` L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height, display: 'block' }}>
      {fill && <path d={fillPath} fill={color} opacity="0.10" />}
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BarChart({ data, height = 80, color = 'var(--accent)', labels = [] }) {
  const max = Math.max(...data);
  return (
    <div>
      <div style={{
        display: 'grid', gridTemplateColumns: `repeat(${data.length}, 1fr)`,
        gap: 6, height, alignItems: 'flex-end',
      }}>
        {data.map((v, i) => (
          <div key={i} style={{
            height: `${(v / max) * 100}%`, minHeight: 4,
            background: color, borderRadius: '4px 4px 1px 1px',
            opacity: i === data.length - 1 ? 1 : 0.7,
          }} title={`${labels[i] || i + 1}: ${v.toLocaleString()}`} />
        ))}
      </div>
      {labels.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${data.length}, 1fr)`, gap: 6, marginTop: 6 }}>
          {labels.map((l, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 10.5, color: 'var(--text-faint)', fontVariantNumeric: 'tabular-nums' }}>{l}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, delta, hint, sparkline, tone }) {
  const deltaPositive = typeof delta === 'string' && (delta.startsWith('+') || delta.endsWith('%'));
  const deltaColor = tone === 'warn'
    ? 'var(--status-idle)'
    : (deltaPositive ? 'var(--status-online)' : 'var(--text-muted)');
  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.02em' }}>{label}</div>
      <div className="row" style={{ marginTop: 4, alignItems: 'baseline', gap: 8 }}>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }} className="mono">{value.toLocaleString()}</div>
        {delta && (
          <div style={{ fontSize: 12, fontWeight: 500, color: deltaColor }}>{delta}</div>
        )}
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 2 }}>{hint}</div>
      {sparkline && (
        <div style={{ marginTop: 10 }}>
          <Sparkline data={sparkline} height={28} color={tone === 'warn' ? 'var(--status-idle)' : 'var(--accent)'} />
        </div>
      )}
    </div>
  );
}

// ── Admin Dashboard ────────────────────────────────────────────────────────
function AdminDashboard({ setRoute }) {
  const s = ADMIN_STATS;
  const dayLabels = ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'];

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Overview" subtitle="Snapshot of the last 7 days.">
        <Button size="sm">Export CSV</Button>
        <Button size="sm" variant="primary">Run report</Button>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total users"     value={s.totalUsers.value}     delta={s.totalUsers.delta}     hint={s.totalUsers.hint}     sparkline={ADMIN_SIGNUPS_7D} />
        <StatCard label="Active now"      value={s.activeNow.value}      delta={s.activeNow.delta}      hint={s.activeNow.hint}      sparkline={ADMIN_DAU_14D} />
        <StatCard label="Open reports"    value={s.openReports.value}    delta={s.openReports.delta}    hint={s.openReports.hint}    tone="warn" />
        <StatCard label="Tasks created"   value={s.totalTasks.value}     delta={s.totalTasks.delta}     hint={s.totalTasks.hint} />
        <StatCard label="Completed"       value={s.completedTasks.value} delta={s.completedTasks.delta} hint={s.completedTasks.hint} />
        <StatCard label="Rooms"           value={s.rooms.value}          delta={s.rooms.delta}          hint={s.rooms.hint} />
      </div>

      <div className="grid-dash" style={{ marginBottom: 0 }}>
        <div className="card">
          <div className="card-hd">
            <h3>Signups · last 7 days</h3>
            <span className="muted mono" style={{ fontSize: 12 }}>{ADMIN_SIGNUPS_7D.reduce((a, b) => a + b, 0)} total</span>
          </div>
          <BarChart data={ADMIN_SIGNUPS_7D} height={120} labels={dayLabels} />
        </div>

        <div className="card">
          <div className="card-hd">
            <h3>Recent signups</h3>
            <span className="card-hd-action" onClick={() => setRoute({ name: 'admin-users' })}>All users <Icon name="chevron-right" size={11} /></span>
          </div>
          <div className="col gap-3">
            {ADMIN_USERS_EXTRA.slice(0, 5).map(u => (
              <div key={u.id} className="row gap-3">
                <Avatar user={u} size={28} />
                <div className="flex1 truncate">
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{u.name}</div>
                  <div className="muted truncate" style={{ fontSize: 11.5 }}>{u.handle} · {u.email}</div>
                </div>
                <span className="muted mono" style={{ fontSize: 11.5 }}>{u.joined}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {ADMIN_REPORTS.length > 0 && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="card-hd">
            <h3>Needs your review</h3>
            <Badge tone="danger">{ADMIN_REPORTS.length} open</Badge>
            <span className="card-hd-action" onClick={() => setRoute({ name: 'admin-reports' })}>Open queue <Icon name="chevron-right" size={11} /></span>
          </div>
          <div className="col gap-2">
            {ADMIN_REPORTS.slice(0, 3).map(r => (
              <div key={r.id} className="row gap-3" style={{ padding: 8, borderRadius: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'color-mix(in oklab, var(--status-busy) 14%, transparent)',
                  color: 'var(--status-busy)',
                  display: 'grid', placeItems: 'center', flexShrink: 0,
                }}>
                  <Icon name={r.kind === 'photo' ? 'image' : r.kind === 'profile' ? 'users' : r.kind === 'task' ? 'check' : 'hash'} size={14} />
                </div>
                <div className="flex1 truncate">
                  <div style={{ fontSize: 13 }}>
                    <b>{r.reason}</b>{' '}
                    <span className="muted">on {r.target.name} · reported by {r.reporter.name}</span>
                  </div>
                  <div className="muted truncate" style={{ fontSize: 11.5 }}>{r.context}</div>
                </div>
                <span className="muted mono" style={{ fontSize: 11.5 }}>{r.when}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Admin Users ────────────────────────────────────────────────────────────
function AdminUsersPage() {
  const [q, setQ] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const allUsers = [
    ...ADMIN_USERS_EXTRA,
    ...FRIENDS.map(f => ({
      id: f.id, name: f.name, handle: f.handle,
      email: f.handle.slice(1) + '@taskyy.app',
      joined: 'Apr 12', tasksDone: Math.floor(Math.random() * 200),
      status: 'active', presence: f.presence, reports: 0,
    })),
  ];
  const filtered = allUsers
    .filter(u => filter === 'all' ? true : u.status === filter)
    .filter(u => !q || u.name.toLowerCase().includes(q.toLowerCase()) || u.handle.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()));

  const StatusBadge = ({ status }) => {
    const map = {
      active: { tone: 'success', label: 'Active' },
      flagged: { tone: 'warn', label: 'Flagged' },
      blocked: { tone: 'danger', label: 'Blocked' },
    };
    return <Badge tone={map[status]?.tone}>{map[status]?.label || status}</Badge>;
  };

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Users" subtitle={`${allUsers.length.toLocaleString()} accounts · search, filter, and moderate.`}>
        <Button size="sm">Invite team</Button>
        <Button size="sm" variant="primary">Export</Button>
      </PageHeader>

      <div className="row gap-3" style={{ marginBottom: 16 }}>
        <div className="input-search flex1" style={{ maxWidth: 360 }}>
          <Icon name="search" size={14} />
          <input className="input" placeholder="Search name, handle, or email" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <div style={{
          display: 'inline-flex', background: 'var(--bg-subtle)', borderRadius: 8, padding: 2,
          border: '1px solid var(--border)',
        }}>
          {[
            { k: 'all',     label: 'All' },
            { k: 'active',  label: 'Active' },
            { k: 'flagged', label: 'Flagged' },
            { k: 'blocked', label: 'Blocked' },
          ].map(t => (
            <button key={t.k} onClick={() => setFilter(t.k)} className="btn btn-sm" style={{
              border: 0, height: 26, padding: '0 12px',
              background: filter === t.k ? 'var(--bg-elevated)' : 'transparent',
              color: filter === t.k ? 'var(--text)' : 'var(--text-muted)',
              boxShadow: filter === t.k ? 'var(--shadow-1)' : 'none',
            }}>{t.label}</button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto' }} className="muted mono" >{filtered.length} results</div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['User', 'Handle', 'Joined', 'Tasks', 'Status', 'Reports', ''].map((h, i) => (
                <th key={i} style={{
                  textAlign: 'left', fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                  color: 'var(--text-muted)', padding: '12px 16px',
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--bg-subtle)',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: i === filtered.length - 1 ? 0 : '1px solid var(--border)' }}>
                <td style={{ padding: '10px 16px' }}>
                  <div className="row gap-3">
                    <Avatar user={u} size={28} status onBg="bg" />
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 500 }}>{u.name}</div>
                      <div className="muted" style={{ fontSize: 11.5 }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '10px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{u.handle}</td>
                <td style={{ padding: '10px 16px', fontSize: 13, color: 'var(--text-muted)' }} className="mono">{u.joined}</td>
                <td style={{ padding: '10px 16px', fontSize: 13 }} className="mono">{u.tasksDone}</td>
                <td style={{ padding: '10px 16px' }}><StatusBadge status={u.status} /></td>
                <td style={{ padding: '10px 16px', fontSize: 13 }} className="mono">
                  {u.reports > 0 ? <span style={{ color: 'var(--status-busy)' }}>{u.reports}</span> : <span className="muted">—</span>}
                </td>
                <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                  <div className="row gap-1" style={{ justifyContent: 'flex-end' }}>
                    <Button size="sm" variant="ghost" icon="eye" />
                    <Button size="sm" variant="ghost" icon="lock" />
                    <Button size="sm" variant="ghost" icon="more" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Admin Reports ──────────────────────────────────────────────────────────
function AdminReportsPage() {
  const [reports, setReports] = React.useState(ADMIN_REPORTS);
  const [selected, setSelected] = React.useState(reports[0]?.id);
  const r = reports.find(x => x.id === selected) || reports[0];

  const resolve = (verdict) => {
    setReports(prev => {
      const next = prev.filter(x => x.id !== selected);
      setSelected(next[0]?.id);
      return next;
    });
  };

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Reports queue" subtitle={`${reports.length} item${reports.length === 1 ? '' : 's'} awaiting review.`}>
        <Button size="sm">Filter</Button>
        <Button size="sm" variant="primary">Mark all reviewed</Button>
      </PageHeader>

      {reports.length === 0 ? (
        <Empty icon="check" title="Inbox zero" hint="No open reports right now. Nice." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, alignItems: 'stretch' }}>
          {/* Queue list */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {reports.map((rep, i) => (
              <div key={rep.id}
                onClick={() => setSelected(rep.id)}
                style={{
                  padding: '12px 14px',
                  borderBottom: i === reports.length - 1 ? 0 : '1px solid var(--border)',
                  background: selected === rep.id ? 'var(--accent-tint)' : 'transparent',
                  borderLeft: selected === rep.id ? '3px solid var(--accent)' : '3px solid transparent',
                  cursor: 'default',
                }}>
                <div className="row gap-2" style={{ marginBottom: 4 }}>
                  <Icon
                    name={rep.kind === 'photo' ? 'image' : rep.kind === 'profile' ? 'users' : rep.kind === 'task' ? 'check' : 'hash'}
                    size={13}
                    style={{ color: 'var(--status-busy)' }}
                  />
                  <span style={{ fontSize: 12.5, fontWeight: 600 }}>{rep.reason}</span>
                  <span className="muted mono" style={{ fontSize: 10.5, marginLeft: 'auto' }}>{rep.when}</span>
                </div>
                <div className="muted truncate" style={{ fontSize: 11.5 }}>
                  on <b style={{ color: 'var(--text-soft)' }}>{rep.target.name}</b> · {rep.context}
                </div>
              </div>
            ))}
          </div>

          {/* Detail */}
          {r && (
            <div className="card" style={{ padding: 0 }}>
              <div style={{
                padding: '18px 22px', borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'color-mix(in oklab, var(--status-busy) 14%, transparent)',
                  color: 'var(--status-busy)',
                  display: 'grid', placeItems: 'center',
                }}>
                  <Icon name="flag" size={18} />
                </div>
                <div className="flex1">
                  <h3 style={{ fontSize: 16 }}>{r.reason}</h3>
                  <div className="muted" style={{ fontSize: 12 }}>{r.context} · reported {r.when} ago</div>
                </div>
                <Badge tone="danger">Open</Badge>
              </div>

              <div style={{ padding: '20px 22px' }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-faint)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Reported content</div>

                {r.kind === 'photo' ? (
                  <div style={{
                    aspectRatio: '16 / 9', borderRadius: 10,
                    background: 'linear-gradient(135deg, #5b3a1f 0%, #d97757 50%, #f4c98a 100%)',
                    display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,0.6)',
                    fontSize: 12, fontWeight: 500, marginBottom: 16,
                  }}>[ daily-memory photo redacted ]</div>
                ) : (
                  <div style={{
                    padding: 16, borderRadius: 10,
                    background: 'var(--bg-subtle)', border: '1px solid var(--border)',
                    fontSize: 14, color: 'var(--text-soft)', marginBottom: 16, lineHeight: 1.5,
                  }}>
                    &ldquo;{r.preview}&rdquo;
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-faint)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Reporter</div>
                    <div className="row gap-2">
                      <Avatar user={r.reporter} size={28} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{r.reporter.name}</div>
                        <div className="muted" style={{ fontSize: 11.5 }}>{r.reporter.handle}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-faint)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Target</div>
                    <div className="row gap-2">
                      <Avatar user={r.target} size={28} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{r.target.name}</div>
                        <div className="muted" style={{ fontSize: 11.5 }}>{r.target.handle}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: 14, borderRadius: 10,
                  background: 'var(--bg-subtle)', border: '1px solid var(--border)',
                  marginBottom: 20,
                }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-faint)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>History on this user</div>
                  <div className="muted" style={{ fontSize: 12.5 }}>
                    {ADMIN_USERS_EXTRA.find(u => u.handle === r.target.handle)?.reports ?? '—'} prior reports ·
                    joined {ADMIN_USERS_EXTRA.find(u => u.handle === r.target.handle)?.joined ?? 'recently'} ·
                    {ADMIN_USERS_EXTRA.find(u => u.handle === r.target.handle)?.status ?? 'active'}
                  </div>
                </div>
              </div>

              <div style={{
                padding: '14px 22px', borderTop: '1px solid var(--border)',
                background: 'var(--bg-subtle)',
                display: 'flex', gap: 8, justifyContent: 'flex-end',
              }}>
                <Button size="sm" onClick={() => resolve('dismiss')}>Dismiss</Button>
                <Button size="sm" onClick={() => resolve('remove')}>Remove content</Button>
                <Button size="sm" style={{ background: 'var(--status-busy)', color: '#fff', borderColor: 'var(--status-busy)' }} onClick={() => resolve('suspend')}>
                  Suspend user
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Placeholder admin pages (rooms, content, settings) ────────────────────
function AdminPlaceholder({ title, icon }) {
  return (
    <div>
      <PageHeader eyebrow="Admin" title={title} />
      <Empty icon={icon} title={`${title} coming soon`} hint="Wired up but not yet built out in this prototype pass." />
    </div>
  );
}

Object.assign(window, {
  AdminSidebar, Sparkline, BarChart, StatCard,
  AdminDashboard, AdminUsersPage, AdminReportsPage, AdminPlaceholder,
});
