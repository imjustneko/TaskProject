// extra-pages.jsx — Feed, Report, Partners, Labels pages

// ═══════════════════════════════════════════════════════════════════════════
// FEED PAGE — social activity stream
// ═══════════════════════════════════════════════════════════════════════════
function FeedPage({ setRoute }) {
  const [tab, setTab] = React.useState('all');
  const [composerOpen, setComposerOpen] = React.useState(false);
  const [draft, setDraft] = React.useState('');

  const items = FEED.filter(f => {
    if (tab === 'mine') return f.mine;
    if (tab === 'friends') return !f.mine;
    return true;
  });

  return (
    <div className="view-narrow">
      <PageHeader eyebrow="Feed" title="What everyone's up to" subtitle="Shared progress from your friends and partners.">
        <Button icon="sparkle">Share progress</Button>
      </PageHeader>

      {/* Composer */}
      <div className="card" style={{ marginBottom: 18, padding: 14 }}>
        <div className="row gap-3" style={{ alignItems: 'flex-start' }}>
          <Avatar user={ME} size={36} onBg="elevated" />
          <div className="flex1">
            <input
              className="input"
              placeholder="Share what you finished or what's next…"
              style={{ background: 'transparent', border: 'none', boxShadow: 'none', height: 30, padding: '0 2px', fontSize: 14 }}
              value={draft}
              onChange={e => { setDraft(e.target.value); setComposerOpen(true); }}
              onFocus={() => setComposerOpen(true)}
            />
            {composerOpen && (
              <div className="row" style={{ marginTop: 10, gap: 6, justifyContent: 'space-between' }}>
                <div className="row gap-1">
                  <Button size="sm" variant="ghost" icon="image" title="Attach photo" />
                  <Button size="sm" variant="ghost" icon="paperclip" title="Attach task" />
                  <Button size="sm" variant="ghost" icon="globe" title="Audience" />
                </div>
                <div className="row gap-2">
                  <Button size="sm" variant="ghost" onClick={() => { setDraft(''); setComposerOpen(false); }}>Cancel</Button>
                  <Button size="sm" variant="accent" disabled={!draft.trim()}>Post</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="row" style={{ marginBottom: 18, gap: 12 }}>
        <SegTabs
          value={tab}
          onChange={setTab}
          options={[
            { k: 'all',     label: `All · ${FEED.length}` },
            { k: 'friends', label: `Friends · ${FEED.filter(f => !f.mine).length}` },
            { k: 'mine',    label: `You · ${FEED.filter(f => f.mine).length}` },
          ]}
        />
        <div className="flex1" />
        <Button size="sm" variant="ghost" icon="settings">Filter</Button>
      </div>

      {/* Stream */}
      <div className="col gap-3">
        {items.map(item => <FeedCard key={item.id} item={item} setRoute={setRoute} />)}
      </div>
    </div>
  );
}

function FeedCard({ item, setRoute }) {
  const u = getUser(item.user);
  if (!u) return null;
  const [reactions, setReactions] = React.useState(item.reactions || {});
  const [reacted, setReacted] = React.useState({});

  const total = Object.values(reactions).reduce((a, b) => a + b, 0);

  const toggleReact = (emoji) => {
    setReactions(r => ({ ...r, [emoji]: (r[emoji] || 0) + (reacted[emoji] ? -1 : 1) }));
    setReacted(r => ({ ...r, [emoji]: !r[emoji] }));
  };

  // Kind-specific lead-in
  const lead = (() => {
    switch (item.kind) {
      case 'task':   return <><b style={{ fontWeight: 600 }}>finished</b> a task</>;
      case 'photo':  return <><b style={{ fontWeight: 600 }}>posted</b> a memory</>;
      case 'streak': return <><b style={{ fontWeight: 600 }}>🔥</b> {item.text}</>;
      case 'plan':   return <><b style={{ fontWeight: 600 }}>made plans</b></>;
      case 'room':   return <><b style={{ fontWeight: 600 }}>{item.text}</b> a room</>;
      default:       return null;
    }
  })();

  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="row gap-3" style={{ alignItems: 'flex-start', marginBottom: 10 }}>
        <Avatar user={u} size={36} status onBg="elevated" />
        <div className="flex1" style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13.5 }}>
            <span style={{ fontWeight: 600 }}>{u.name}</span>{' '}
            <span className="muted" style={{ fontWeight: 400 }}>{lead}</span>
          </div>
          <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>
            {u.handle ?? '@' + u.name.toLowerCase().split(' ')[0]} · {item.when} ago
          </div>
        </div>
        <Button size="sm" variant="ghost" icon="more" />
      </div>

      {/* Task body */}
      {item.kind === 'task' && (
        <div style={{
          padding: '12px 14px', borderRadius: 10,
          background: 'var(--bg-subtle)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: 'var(--accent)', display: 'grid', placeItems: 'center',
            color: '#fff', flexShrink: 0,
            boxShadow: '0 1px 2px rgba(212,98,26,0.3)',
          }}>
            <Icon name="check" size={13} />
          </div>
          <div className="flex1" style={{ fontSize: 13.5, fontWeight: 500 }}>{item.task}</div>
          {item.room && <span className="muted" style={{ fontSize: 11.5 }}>in {item.room}</span>}
        </div>
      )}

      {/* Photo body */}
      {item.kind === 'photo' && (
        <div>
          <div style={{ fontSize: 13.5, marginBottom: 10, lineHeight: 1.5 }}>{item.text}</div>
          <div style={{
            width: '100%', height: 280, borderRadius: 14,
            ...item.photoStyle,
            border: '1px solid var(--border)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
          }} />
        </div>
      )}

      {/* Plan / Streak / Room body */}
      {(item.kind === 'plan' || item.kind === 'room') && item.meta && (
        <div style={{
          padding: '10px 12px', borderRadius: 10,
          background: 'var(--bg-subtle)', border: '1px solid var(--border)',
          fontSize: 13, color: 'var(--text-soft)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Icon name={item.kind === 'room' ? 'hash' : 'calendar'} size={14} style={{ color: 'var(--text-muted)' }} />
          {item.meta}
        </div>
      )}
      {item.kind === 'streak' && (
        <div style={{
          padding: '14px 16px', borderRadius: 12,
          background: 'linear-gradient(135deg, var(--accent-tint), var(--accent-tint-strong))',
          border: '1px solid var(--accent-tint-strong)',
          fontSize: 22, fontWeight: 700, color: 'var(--accent)',
          textAlign: 'center', letterSpacing: '-0.02em',
        }}>🔥 30-day streak</div>
      )}

      {/* Reactions */}
      <div className="row" style={{ marginTop: 12, gap: 6, flexWrap: 'wrap' }}>
        {Object.entries(reactions).filter(([, n]) => n > 0).map(([emoji, n]) => (
          <button key={emoji} onClick={() => toggleReact(emoji)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 9px', borderRadius: 999,
            border: `1px solid ${reacted[emoji] ? 'var(--accent)' : 'var(--border-strong)'}`,
            background: reacted[emoji] ? 'var(--accent-tint)' : 'var(--bg-elevated)',
            color: reacted[emoji] ? 'var(--accent)' : 'var(--text-soft)',
            fontSize: 12, fontWeight: 600, cursor: 'default',
            transition: 'all 120ms var(--ease-out)',
          }}>
            <span style={{ fontSize: 13 }}>{emoji}</span>
            <span className="mono">{n}</span>
          </button>
        ))}
        <button onClick={() => toggleReact('🙌')} style={{
          width: 28, height: 24, borderRadius: 999,
          border: '1px dashed var(--border-strong)',
          background: 'transparent', color: 'var(--text-faint)',
          fontSize: 13, cursor: 'default',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }} title="Add reaction">+</button>

        <div className="flex1" />
        <button className="btn btn-ghost btn-sm" style={{ gap: 5 }}>
          <Icon name="send" size={12} />
          Reply
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// REPORT PAGE — analytics deep-dive
// ═══════════════════════════════════════════════════════════════════════════
function ReportPage() {
  const [range, setRange] = React.useState('30d');
  const k = REPORT.kpi;

  return (
    <div>
      <PageHeader
        eyebrow="Report"
        title="Your patterns"
        subtitle={`${REPORT.range.from} – ${REPORT.range.to} · how you've been showing up`}
      >
        <SegTabs
          value={range}
          onChange={setRange}
          options={[{ k: '7d', label: '7d' }, { k: '30d', label: '30d' }, { k: '90d', label: '90d' }, { k: 'all', label: 'All' }]}
        />
        <Button icon="archive">Export</Button>
      </PageHeader>

      {/* KPI strip */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22,
      }}>
        <KPICard label="Completion rate" value={`${k.completionRate}%`} delta={k.completionDelta} unit="pp" />
        <KPICard label="Tasks done"       value={k.tasksDone}            delta={k.tasksDelta} />
        <KPICard label="Avg per day"      value={k.avgPerDay.toFixed(1)} delta={k.avgDelta} suffix="tasks" />
        <KPICard label="Current streak"   value={`🔥 ${k.streak}`}        sub={`Best: ${k.streakBest}`} />
      </div>

      {/* Heatmap */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-hd">
          <h3>Daily activity</h3>
          <span className="muted" style={{ fontSize: 12 }}>Last 4 weeks</span>
        </div>
        <Heatmap data={REPORT.heatmap} />
      </div>

      {/* Two-up: Category + Weekday */}
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-hd">
            <h3>By category</h3>
            <span className="muted" style={{ fontSize: 12 }}>{REPORT.byCategory.reduce((a, b) => a + b.count, 0)} tasks</span>
          </div>
          <CategoryBars data={REPORT.byCategory} />
        </div>
        <div className="card">
          <div className="card-hd">
            <h3>By weekday</h3>
            <span className="muted" style={{ fontSize: 12 }}>Tue is your strongest</span>
          </div>
          <WeekdayChart data={REPORT.byWeekday} />
        </div>
      </div>

      {/* Hour breakdown */}
      <div className="card">
        <div className="card-hd">
          <h3>Peak hours</h3>
          <span className="muted" style={{ fontSize: 12 }}>You ship most around 9 AM and 6 PM</span>
        </div>
        <HourChart data={REPORT.byHour} />
      </div>
    </div>
  );
}

function KPICard({ label, value, delta, unit = '', suffix, sub }) {
  const up = delta != null && delta > 0;
  const down = delta != null && delta < 0;
  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div className="row" style={{ alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
        <span style={{
          fontSize: 26, fontWeight: 700, color: 'var(--text)',
          letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums',
        }}>{value}</span>
        {suffix && <span className="muted" style={{ fontSize: 12 }}>{suffix}</span>}
      </div>
      {delta != null && (
        <div className="row gap-1" style={{ fontSize: 11.5, fontWeight: 600 }}>
          <span style={{ color: up ? '#1a7a38' : down ? '#c8231a' : 'var(--text-muted)' }}>
            {up ? '↗' : down ? '↘' : '→'} {delta > 0 ? '+' : ''}{delta}{unit}
          </span>
          <span className="muted" style={{ fontWeight: 400 }}>vs prev period</span>
        </div>
      )}
      {sub && <div className="muted" style={{ fontSize: 11.5 }}>{sub}</div>}
    </div>
  );
}

function Heatmap({ data }) {
  // 28 days → 4 weeks × 7 days
  const cellsByLevel = (n) => {
    if (n === 0) return { background: 'var(--bg-subtle)', border: '1px solid var(--border)' };
    const opacity = 0.25 + n * 0.18;
    return {
      background: `color-mix(in srgb, var(--accent) ${Math.round(opacity * 100)}%, var(--bg-subtle))`,
      border: '1px solid var(--border)',
    };
  };
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Day labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 2 }}>
          {dayLabels.map((d, i) => (
            <div key={i} style={{ fontSize: 10, color: 'var(--text-faint)', height: 18, lineHeight: '18px' }}>{d}</div>
          ))}
        </div>
        {/* Grid — 4 columns × 7 rows */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
          {[0, 1, 2, 3].map(week => (
            <div key={week} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[0, 1, 2, 3, 4, 5, 6].map(day => {
                const idx = week * 7 + day;
                const n = data[idx] ?? 0;
                return (
                  <div key={day} title={`${n} tasks`} style={{
                    height: 18, borderRadius: 4,
                    ...cellsByLevel(n),
                    transition: 'transform 120ms var(--ease-out)',
                  }} />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="row" style={{ marginTop: 14, justifyContent: 'flex-end', gap: 6 }}>
        <span className="muted" style={{ fontSize: 11 }}>Less</span>
        {[0, 1, 2, 3, 4].map(n => (
          <div key={n} style={{ width: 14, height: 14, borderRadius: 3, ...cellsByLevel(n) }} />
        ))}
        <span className="muted" style={{ fontSize: 11 }}>More</span>
      </div>
    </div>
  );
}

function CategoryBars({ data }) {
  const max = Math.max(...data.map(d => d.count));
  return (
    <div className="col gap-3">
      {data.map(d => (
        <div key={d.key}>
          <div className="row" style={{ marginBottom: 5, gap: 8 }}>
            <i style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>{d.key}</span>
            <span className="flex1" />
            <span className="mono muted" style={{ fontSize: 12 }}>{d.count}</span>
          </div>
          <div style={{
            height: 6, borderRadius: 999, background: 'var(--bg-subtle)',
            border: '1px solid var(--border)', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${(d.count / max) * 100}%`,
              background: d.color, borderRadius: 999,
              transition: 'width 400ms var(--ease-out)',
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function WeekdayChart({ data }) {
  const max = Math.max(...data.map(d => d.count));
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6,
      alignItems: 'end', height: 160, paddingTop: 8,
    }}>
      {data.map(d => {
        const h = Math.max(8, Math.round((d.count / max) * 140));
        const strongest = d.count === max;
        return (
          <div key={d.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%' }}>
              <div style={{
                width: '100%', height: h, borderRadius: '4px 4px 2px 2px',
                background: strongest
                  ? 'linear-gradient(180deg, var(--accent), var(--accent-press))'
                  : 'var(--accent-tint-strong)',
                border: strongest ? 'none' : '1px solid var(--accent-tint-strong)',
                boxShadow: strongest ? '0 1px 3px rgba(212,98,26,0.3)' : 'none',
                position: 'relative',
              }}>
                {strongest && (
                  <div className="mono" style={{
                    position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)',
                    fontSize: 10.5, fontWeight: 700, color: 'var(--accent)',
                  }}>{d.count}</div>
                )}
              </div>
            </div>
            <div style={{
              fontSize: 11,
              color: strongest ? 'var(--accent)' : 'var(--text-muted)',
              fontWeight: strongest ? 700 : 500,
            }}>{d.key}</div>
          </div>
        );
      })}
    </div>
  );
}

function HourChart({ data }) {
  const max = Math.max(...data);
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', gap: 2, alignItems: 'end', height: 90 }}>
        {data.map((v, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
            <div title={`${i}:00 — ${v} tasks`} style={{
              width: '100%',
              height: `${Math.max(2, (v / max) * 100)}%`,
              borderRadius: 2,
              background: v === max
                ? 'var(--accent)'
                : v > 0
                  ? 'var(--accent-tint-strong)'
                  : 'var(--bg-subtle)',
              border: v === 0 ? '1px solid var(--border)' : 'none',
              transition: 'height 400ms var(--ease-out)',
            }} />
          </div>
        ))}
      </div>
      <div className="row" style={{ marginTop: 8, justifyContent: 'space-between', fontSize: 10.5, color: 'var(--text-faint)' }}>
        {[0, 6, 12, 18, 23].map(h => <span key={h}>{h}:00</span>)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PARTNERS PAGE — full partner dashboard
// ═══════════════════════════════════════════════════════════════════════════
function PartnersPage({ setRoute }) {
  const [tab, setTab] = React.useState('active');

  if (PARTNERS.length === 0) {
    return (
      <div className="view-narrow">
        <PageHeader eyebrow="Partners" title="Stay accountable, together" />
        <div className="card" style={{ padding: 0 }}>
          <Empty
            icon="users"
            title="No accountability partners yet"
            hint="Pair with a friend to share daily progress, keep streaks alive, and gently push each other to follow through."
            action={<Button variant="accent" icon="plus" onClick={() => setRoute({ name: 'friends' })}>Find a partner</Button>}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Partners"
        title="Stay accountable, together"
        subtitle="People you've paired with to keep streaks alive."
      >
        <Button icon="plus" variant="accent">Add partner</Button>
      </PageHeader>

      {/* Requests strip */}
      {PARTNER_REQUESTS.length > 0 && (
        <div className="card" style={{ marginBottom: 18, padding: 14 }}>
          <div className="row gap-3">
            <div style={{
              width: 36, height: 36, borderRadius: 10, display: 'grid', placeItems: 'center',
              background: 'var(--accent-tint)', color: 'var(--accent)', flexShrink: 0,
            }}><Icon name="users" size={18} /></div>
            <div className="flex1">
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>
                <b>{getUser(PARTNER_REQUESTS[0].from)?.name}</b> wants to be your partner
              </div>
              <div className="muted" style={{ fontSize: 12 }}>"{PARTNER_REQUESTS[0].pact}" · {PARTNER_REQUESTS[0].when} ago</div>
            </div>
            <Button size="sm">Decline</Button>
            <Button size="sm" variant="accent">Accept</Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="row" style={{ marginBottom: 18, gap: 12 }}>
        <SegTabs
          value={tab}
          onChange={setTab}
          options={[
            { k: 'active',   label: `Active · ${PARTNERS.length}` },
            { k: 'pending',  label: `Pending · ${PARTNER_REQUESTS.length}` },
            { k: 'paused',   label: 'Paused · 0' },
          ]}
        />
      </div>

      {/* Pair cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 16 }}>
        {PARTNERS.map(p => <PartnerCard key={p.pairId} pair={p} setRoute={setRoute} />)}
      </div>
    </div>
  );
}

function PartnerCard({ pair, setRoute }) {
  const u = getUser(pair.partnerId);
  if (!u) return null;
  const pctVal = pair.todayTotal === 0 ? 0 : Math.round((pair.todayDone / pair.todayTotal) * 100);
  const complete = pair.todayTotal > 0 && pair.todayDone === pair.todayTotal;

  return (
    <div className="card" style={{ padding: 18 }}>
      {/* Header — twin avatars */}
      <div className="row" style={{ marginBottom: 14, gap: 12, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Avatar user={ME} size={36} status onBg="elevated" />
          <div style={{ marginLeft: -10, boxShadow: '0 0 0 2.5px var(--bg-elevated)', borderRadius: '50%' }}>
            <Avatar user={u} size={36} status onBg="elevated" />
          </div>
        </div>
        <div className="flex1" style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            You &amp; {u.name.split(' ')[0]}
          </div>
          <div className="muted" style={{ fontSize: 11.5 }}>
            Since {pair.since} · joint streak 🔥 {pair.jointStreak}
          </div>
        </div>
        <Button size="sm" variant="ghost" icon="more" />
      </div>

      {/* Pact */}
      <div style={{
        padding: '10px 12px', borderRadius: 10, marginBottom: 14,
        background: 'var(--bg-subtle)', border: '1px solid var(--border)',
        fontSize: 12.5, color: 'var(--text-soft)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Icon name="flag" size={13} style={{ color: 'var(--text-muted)' }} />
        {pair.pact}
      </div>

      {/* Today progress row */}
      <div className="row" style={{ marginBottom: 14, gap: 16 }}>
        <PartnerSide label="You"           done={Math.min(pair.todayDone + 1, pair.todayTotal)} total={pair.todayTotal} />
        <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--border)' }} />
        <PartnerSide label={u.name.split(' ')[0]} done={pair.todayDone} total={pair.todayTotal} accent />
      </div>

      {/* Joint sparkline */}
      <div>
        <div className="row" style={{ marginBottom: 6 }}>
          <span className="muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Last 14 days</span>
          <span className="flex1" />
          <span className="mono muted" style={{ fontSize: 11 }}>{Math.round(pair.spark.reduce((a, b) => a + b, 0) / pair.spark.length * 100)}% on track</span>
        </div>
        <PartnerSparkline data={pair.spark} complete={complete} />
      </div>

      <div className="row" style={{ marginTop: 14, justifyContent: 'flex-end', gap: 8 }}>
        <Button size="sm" variant="ghost" icon="send">Nudge</Button>
        <Button size="sm">View pair</Button>
      </div>
    </div>
  );
}

function PartnerSide({ label, done, total, accent }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const complete = total > 0 && done === total;
  return (
    <div className="flex1" style={{ minWidth: 0 }}>
      <div className="muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div className="row" style={{ alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
        <span style={{
          fontSize: 22, fontWeight: 700,
          color: complete ? 'var(--status-online)' : accent ? 'var(--accent)' : 'var(--text)',
          letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums',
        }}>{done}</span>
        <span className="muted mono" style={{ fontSize: 13 }}>/ {total}</span>
        {complete && <Icon name="check" size={13} style={{ color: 'var(--status-online)', marginLeft: 2 }} />}
      </div>
      <div style={{
        height: 4, borderRadius: 999, background: 'var(--bg-subtle)',
        border: '1px solid var(--border)', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: complete
            ? 'linear-gradient(90deg, #1ca554, var(--status-online))'
            : accent
              ? 'linear-gradient(90deg, var(--accent), #e88334)'
              : 'var(--text-muted)',
          borderRadius: 999,
          transition: 'width 400ms var(--ease-out)',
        }} />
      </div>
    </div>
  );
}

function PartnerSparkline({ data, complete }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: `repeat(${data.length}, 1fr)`,
      gap: 3, alignItems: 'end', height: 28,
    }}>
      {data.map((v, i) => {
        const h = Math.max(3, Math.round(v * 24));
        return (
          <div key={i} style={{ height: '100%', display: 'flex', alignItems: 'flex-end' }}>
            <div style={{
              width: '100%', height: h,
              borderRadius: 2,
              background: v >= 0.99
                ? complete ? 'var(--status-online)' : 'var(--accent)'
                : v > 0
                  ? complete ? 'rgba(48,209,88,0.35)' : 'var(--accent-tint-strong)'
                  : 'var(--bg-subtle)',
              border: v === 0 ? '1px solid var(--border)' : 'none',
            }} />
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LABELS PAGE — manage tags
// ═══════════════════════════════════════════════════════════════════════════
const LABEL_COLOR_OPTIONS = [
  '#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4',
  '#0ea5e9', '#7c3aed', '#a855f7', '#ec4899', '#84cc16',
];

function LabelsPage() {
  const [labels, setLabels] = React.useState(LABELS);
  const [composeOpen, setComposeOpen] = React.useState(false);
  const [draft, setDraft] = React.useState({ name: '', color: LABEL_COLOR_OPTIONS[0] });

  const create = () => {
    if (!draft.name.trim()) return;
    setLabels(prev => [...prev, {
      id: 'l' + Date.now(), name: draft.name.trim(), color: draft.color, count: 0, recent: [],
    }]);
    setDraft({ name: '', color: LABEL_COLOR_OPTIONS[0] });
    setComposeOpen(false);
  };
  const remove = (id) => setLabels(prev => prev.filter(l => l.id !== id));

  return (
    <div className="view-narrow">
      <PageHeader eyebrow="Labels" title="Organize your work" subtitle="Tag tasks to filter, search, and report on what matters.">
        <Button icon="plus" variant="accent" onClick={() => setComposeOpen(v => !v)}>New label</Button>
      </PageHeader>

      {/* Composer */}
      {composeOpen && (
        <div className="card" style={{ marginBottom: 16, padding: 18, animation: 'slide-up 200ms var(--ease-out)' }}>
          <div className="card-hd"><h3>Create a label</h3></div>
          <div className="col gap-4">
            <div className="field">
              <label className="field-label">Name</label>
              <input
                className="input"
                placeholder="e.g. Side project"
                value={draft.name}
                onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                autoFocus
                onKeyDown={e => e.key === 'Enter' && create()}
              />
            </div>
            <div className="field">
              <label className="field-label">Color</label>
              <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                {LABEL_COLOR_OPTIONS.map(c => (
                  <button key={c} onClick={() => setDraft(d => ({ ...d, color: c }))} style={{
                    width: 28, height: 28, borderRadius: '50%', background: c,
                    border: '2px solid',
                    borderColor: draft.color === c ? 'var(--text)' : 'transparent',
                    boxShadow: '0 0 0 1px var(--border)',
                    cursor: 'default',
                    transition: 'transform 120ms var(--ease-out)',
                    transform: draft.color === c ? 'scale(1.08)' : 'scale(1)',
                  }} />
                ))}
              </div>
            </div>
            {/* Preview */}
            <div className="field">
              <label className="field-label">Preview</label>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 9px', borderRadius: 999,
                background: `color-mix(in srgb, ${draft.color} 14%, transparent)`,
                color: draft.color, border: `1px solid color-mix(in srgb, ${draft.color} 35%, transparent)`,
                fontSize: 12, fontWeight: 600, width: 'fit-content',
              }}>
                <i style={{ width: 7, height: 7, borderRadius: '50%', background: draft.color }} />
                {draft.name || 'New label'}
              </span>
            </div>
            <div className="row gap-2" style={{ justifyContent: 'flex-end' }}>
              <Button onClick={() => { setComposeOpen(false); setDraft({ name: '', color: LABEL_COLOR_OPTIONS[0] }); }}>Cancel</Button>
              <Button variant="accent" disabled={!draft.name.trim()} onClick={create}>Create label</Button>
            </div>
          </div>
        </div>
      )}

      {/* Stats strip */}
      <div className="row" style={{ marginBottom: 18, gap: 12, padding: '12px 16px', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 12 }}>
        <div className="row gap-2">
          <Icon name="tag" size={14} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 13 }}>
            <b>{labels.length}</b> <span className="muted">labels ·</span>{' '}
            <b>{labels.reduce((a, b) => a + b.count, 0)}</b> <span className="muted">tagged tasks</span>
          </span>
        </div>
        <span className="flex1" />
        <span className="muted" style={{ fontSize: 12 }}>Drag to reorder ·  click to edit</span>
      </div>

      {/* Labels list */}
      {labels.length === 0 ? (
        <div className="card" style={{ padding: 0 }}>
          <Empty
            icon="sparkle"
            title="No labels yet"
            hint="Labels let you group tasks beyond categories — by context, mood, or project."
            action={<Button variant="accent" icon="plus" onClick={() => setComposeOpen(true)}>Create your first label</Button>}
          />
        </div>
      ) : (
        <div className="col gap-2">
          {labels.map(l => <LabelRow key={l.id} label={l} onRemove={() => remove(l.id)} />)}
        </div>
      )}
    </div>
  );
}

function LabelRow({ label, onRemove }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      className="card"
      style={{ padding: '14px 16px', cursor: 'default' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="row" style={{ gap: 14 }}>
        {/* Drag handle */}
        <div style={{
          width: 12, color: 'var(--text-faint)',
          opacity: hover ? 1 : 0.3, transition: 'opacity 120ms',
          cursor: 'default', lineHeight: 1, fontSize: 14,
        }}>⋮⋮</div>

        {/* Color swatch */}
        <div style={{
          width: 14, height: 14, borderRadius: 4, background: label.color,
          boxShadow: `0 0 0 3px color-mix(in srgb, ${label.color} 18%, transparent)`,
          flexShrink: 0,
        }} />

        {/* Name */}
        <div className="flex1" style={{ minWidth: 0 }}>
          <div className="row" style={{ gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{label.name}</span>
            <span className="badge" style={{ background: 'var(--bg-subtle)' }}>{label.count}</span>
          </div>
          {label.recent.length > 0 && (
            <div className="muted truncate" style={{ fontSize: 12, marginTop: 2 }}>
              Recent: {label.recent.slice(0, 2).join(' · ')}
            </div>
          )}
        </div>

        {/* Mini bar showing relative count */}
        <div style={{
          width: 80, height: 4, borderRadius: 999,
          background: 'var(--bg-subtle)', border: '1px solid var(--border)',
          overflow: 'hidden', flexShrink: 0,
        }}>
          <div style={{
            height: '100%', width: `${Math.min(100, (label.count / 64) * 100)}%`,
            background: label.color, borderRadius: 999,
            transition: 'width 400ms var(--ease-out)',
          }} />
        </div>

        {/* Hover actions */}
        <div className="row gap-1" style={{ opacity: hover ? 1 : 0, transition: 'opacity 120ms', flexShrink: 0 }}>
          <Button size="sm" variant="ghost" icon="edit" />
          <Button size="sm" variant="ghost" icon="x" onClick={onRemove} title="Delete label" />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Segmented tabs — shared
// ═══════════════════════════════════════════════════════════════════════════
function SegTabs({ value, onChange, options }) {
  return (
    <div style={{
      display: 'inline-flex', background: 'var(--bg-subtle)', borderRadius: 8, padding: 2,
      border: '1px solid var(--border)',
    }}>
      {options.map(t => (
        <button key={t.k} onClick={() => onChange(t.k)} style={{
          border: 0, padding: '5px 12px', borderRadius: 6, cursor: 'default',
          background: value === t.k ? 'var(--bg-elevated)' : 'transparent',
          color: value === t.k ? 'var(--text)' : 'var(--text-muted)',
          fontSize: 12, fontWeight: value === t.k ? 600 : 500,
          boxShadow: value === t.k ? 'var(--shadow-1)' : 'none',
          transition: 'all 120ms var(--ease-out)',
          fontFamily: 'inherit',
        }}>{t.label}</button>
      ))}
    </div>
  );
}

Object.assign(window, { FeedPage, ReportPage, PartnersPage, LabelsPage, SegTabs });
