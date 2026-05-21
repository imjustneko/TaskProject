// task-page.jsx — Dashboard, Today, Plans (task-related views)

// ── TaskRow ────────────────────────────────────────────────────────────────
function TaskRow({ task, onToggle, onOpen, showWhen }) {
  return (
    <div className={'list-row' + (task.done ? ' is-done' : '')} onClick={() => onOpen && onOpen(task)}>
      <input type="checkbox" className="cb" checked={task.done} onChange={(e) => { e.stopPropagation(); onToggle(task.id); }} onClick={(e) => e.stopPropagation()} />
      <PriorityDot level={task.priority} />
      <div className="flex1">
        <div className="task-title" style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text)' }}>{task.title}</div>
      </div>
      <CategoryTag category={task.category} />
      {showWhen && task.date && (
        <span className="muted mono" style={{ fontSize: 12, minWidth: 64, textAlign: 'right' }}>{task.date}</span>
      )}
      {task.time && (
        <span className="muted mono" style={{ fontSize: 12, minWidth: 44, textAlign: 'right' }}>{task.time}</span>
      )}
      {task.shared && (
        <span title="Shared with friends" className="muted" style={{ display: 'inline-flex' }}>
          <Icon name="users" size={13} />
        </span>
      )}
      {task.photo && (
        <span title="Daily memory photo" className="muted" style={{ display: 'inline-flex' }}>
          <Icon name="image" size={13} />
        </span>
      )}
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────
function Dashboard({ tasks, onToggle, onCompose, setRoute }) {
  const today = tasks.filter(t => t.when === 'today');
  const doneToday = today.filter(t => t.done).length;
  const totalToday = today.length;
  const progress = Math.round((doneToday / Math.max(1, totalToday)) * 100);

  const upcoming = tasks.filter(t => t.when !== 'today' && t.when !== 'someday').slice(0, 4);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div>
      <PageHeader
        eyebrow={new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        title={`${greeting}, ${ME.name.split(' ')[0]}`}
        subtitle={progress === 100 ? 'You’re done for the day. Nice work.' : `${doneToday} of ${totalToday} tasks done · ${totalToday - doneToday} to go`}
      >
        <Button icon="plus" variant="accent" onClick={onCompose}>New task</Button>
      </PageHeader>

      {/* Progress strip */}
      <div style={{ marginBottom: 24 }}>
        <Progress value={progress} height={6} />
      </div>

      <div className="grid-dash">
        {/* LEFT — Today's tasks */}
        <div className="col gap-5">
          <div className="card">
            <div className="card-hd">
              <h3>Today</h3>
              <span className="muted" style={{ fontSize: 12 }}>{doneToday}/{totalToday}</span>
              <span className="card-hd-action" onClick={() => setRoute({ name: 'today' })}>View all <Icon name="chevron-right" size={11} /></span>
            </div>
            <div className="list">
              {today.slice(0, 5).map(t => (
                <TaskRow key={t.id} task={t} onToggle={onToggle} />
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-hd">
              <h3>Upcoming</h3>
              <span className="card-hd-action" onClick={() => setRoute({ name: 'plans' })}>All plans <Icon name="chevron-right" size={11} /></span>
            </div>
            <div className="list">
              {upcoming.map(t => (
                <TaskRow key={t.id} task={t} onToggle={onToggle} showWhen />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Social */}
        <div className="col gap-5">
          <StreakCard />
          <StatsCard />
          <PartnersCard setRoute={setRoute} />
          <FriendsStatusCard setRoute={setRoute} />
          <ActiveRoomsCard setRoute={setRoute} />
          <FriendFeedCard />
        </div>
      </div>
    </div>
  );
}

// ── Streak card — hero number + week dots ─────────────────────────────────
function StreakCard() {
  const { current, best, weekly } = STREAK;
  const max = Math.max(...weekly, 1);
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayIdx = new Date().getDay(); // 0 = Sun
  const todayInWeek = todayIdx === 0 ? 6 : todayIdx - 1;

  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* ambient orange glow */}
      <div aria-hidden style={{
        position: 'absolute', top: -40, right: -40, width: 160, height: 160,
        background: 'radial-gradient(circle, var(--accent-tint-strong), transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div className="card-hd" style={{ position: 'relative' }}>
        <h3>Daily streak</h3>
        <Badge tone="accent" dot>Active</Badge>
      </div>

      <div className="row" style={{ alignItems: 'flex-end', gap: 18, position: 'relative', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, lineHeight: 1 }}>
          <span style={{ fontSize: 18 }}>🔥</span>
          <span style={{
            fontSize: 44, fontWeight: 700, color: 'var(--accent)',
            letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums',
          }}>{current}</span>
          <span className="muted" style={{ fontSize: 13, fontWeight: 500 }}>day{current === 1 ? '' : 's'}</span>
        </div>
        <div className="flex1" />
        <div style={{ textAlign: 'right' }}>
          <div className="muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Best</div>
          <div className="mono" style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-soft)' }}>{best}</div>
        </div>
      </div>

      {/* mini week bars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, position: 'relative' }}>
        {weekly.map((v, i) => {
          const isToday = i === todayInWeek;
          const h = Math.max(8, Math.round((v / max) * 38));
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: '100%', height: 40, display: 'flex', alignItems: 'flex-end',
              }}>
                <div style={{
                  width: '100%', height: h,
                  borderRadius: 4,
                  background: v === 0
                    ? 'var(--bg-subtle)'
                    : isToday
                      ? 'linear-gradient(180deg, var(--accent), var(--accent-press))'
                      : 'var(--accent-tint-strong)',
                  border: isToday ? 'none' : '1px solid var(--accent-tint-strong)',
                  boxShadow: isToday ? '0 1px 3px rgba(212,98,26,0.3)' : 'none',
                  transition: 'height 400ms var(--ease-out)',
                }} />
              </div>
              <div style={{
                fontSize: 10.5,
                color: isToday ? 'var(--accent)' : 'var(--text-faint)',
                fontWeight: isToday ? 700 : 500,
              }}>{labels[i]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Stats card — hero + sidekicks ─────────────────────────────────────────
function StatsCard() {
  const { today, week, total } = STATS;
  const weekPct = Math.round((week.done / Math.max(1, week.total)) * 100);

  // 14-day sparkline (completion ratio per day)
  const series = PROGRESS_HISTORY.map(p => p.total === 0 ? 0 : p.done / p.total);
  const W = 220, H = 36, P = 2;
  const points = series.map((v, i) => {
    const x = P + (i / (series.length - 1)) * (W - 2 * P);
    const y = H - P - v * (H - 2 * P);
    return [x, y];
  });
  const path = points.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(' ');
  const area = `${path} L${points[points.length - 1][0]},${H} L${points[0][0]},${H} Z`;

  return (
    <div className="card">
      <div className="card-hd">
        <h3>Stats</h3>
        <span className="muted" style={{ fontSize: 12 }}>Last 14 days</span>
      </div>

      <div className="row" style={{ alignItems: 'flex-start', gap: 16, marginBottom: 12 }}>
        {/* Hero — Today */}
        <div style={{ flex: '0 0 auto' }}>
          <div className="muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>Today</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, lineHeight: 1 }}>
            <span style={{
              fontSize: 32, fontWeight: 700, color: 'var(--text)',
              letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums',
            }}>{today.done}</span>
            <span className="muted mono" style={{ fontSize: 14 }}>/ {today.total}</span>
          </div>
        </div>

        {/* Sparkline */}
        <div style={{ flex: 1, paddingTop: 6 }}>
          <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block' }}>
            <defs>
              <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.32" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#sparkFill)" />
            <path d={path} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* end dot */}
            <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="2.5" fill="var(--accent)" />
          </svg>
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
        borderTop: '1px solid var(--border)', paddingTop: 12,
      }}>
        <div>
          <div className="muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 3 }}>This week</div>
          <div className="row" style={{ alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 17, fontWeight: 600, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.015em' }}>{week.done}</span>
            <span className="muted mono" style={{ fontSize: 12 }}>/ {week.total}</span>
            <span className="badge" data-tone="success" style={{ marginLeft: 4, height: 17, padding: '0 6px', fontSize: 10 }}>{weekPct}%</span>
          </div>
        </div>
        <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 16 }}>
          <div className="muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 3 }}>All-time</div>
          <div className="row" style={{ alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 17, fontWeight: 600, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.015em' }}>{total.done}</span>
            <span className="muted" style={{ fontSize: 11 }}>tasks done</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Partners card ─────────────────────────────────────────────────────────
function PartnersCard({ setRoute }) {
  if (!PARTNERS || PARTNERS.length === 0) {
    return (
      <div className="card">
        <div className="card-hd"><h3>Partners</h3></div>
        <Empty
          variant="inline"
          icon="users"
          title="No accountability partners"
          hint="Pair up with a friend to keep each other on track."
          action={<Button size="sm" variant="primary" icon="plus" onClick={() => setRoute({ name: 'friends' })}>Find a partner</Button>}
        />
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-hd">
        <h3>Partners · today</h3>
        <span className="card-hd-action">All <Icon name="chevron-right" size={11} /></span>
      </div>
      <div className="col gap-4">
        {PARTNERS.map(p => {
          const u = getUser(p.partnerId);
          if (!u) return null;
          const pctVal = p.todayTotal === 0 ? 0 : Math.round((p.todayDone / p.todayTotal) * 100);
          const complete = p.todayTotal > 0 && p.todayDone === p.todayTotal;
          return (
            <div key={p.pairId} className="row gap-3" style={{ cursor: 'default' }} onClick={() => setRoute({ name: 'friend', id: p.partnerId })}>
              <Avatar user={u} size={36} status onBg="bg" />
              <div className="flex1" style={{ minWidth: 0 }}>
                <div className="row" style={{ marginBottom: 6, gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{u.name.split(' ')[0]}</span>
                  <span className="muted" style={{ fontSize: 11.5, whiteSpace: 'nowrap' }}>· 🔥 {p.streak}d</span>
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: 11.5, fontWeight: 600,
                    fontVariantNumeric: 'tabular-nums',
                    color: complete ? 'var(--status-online)' : 'var(--text-soft)',
                  }}>
                    {complete && <Icon name="check" size={11} style={{ marginRight: 3, verticalAlign: '-1px' }} />}
                    {p.todayDone}/{p.todayTotal}
                  </span>
                </div>
                <div style={{
                  height: 4, borderRadius: 999, background: 'var(--bg-subtle)',
                  border: '1px solid var(--border)', overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', width: `${pctVal}%`,
                    background: complete
                      ? 'linear-gradient(90deg, #1ca554, var(--status-online))'
                      : 'linear-gradient(90deg, var(--accent), #e88334)',
                    borderRadius: 999,
                    transition: 'width 400ms var(--ease-out)',
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FriendsStatusCard({ setRoute }) {
  const online = FRIENDS.filter(f => f.status);
  return (
    <div className="card">
      <div className="card-hd">
        <h3>Friends · now</h3>
        <span className="muted" style={{ fontSize: 12 }}>{online.length} active</span>
        <span className="card-hd-action" onClick={() => setRoute({ name: 'friends' })}>See all <Icon name="chevron-right" size={11} /></span>
      </div>
      <div className="col gap-3">
        {online.slice(0, 5).map(f => (
          <div key={f.id} className="row gap-3" style={{ cursor: 'default' }} onClick={() => setRoute({ name: 'friend', id: f.id })}>
            <Avatar user={f} size={32} status onBg="bg" />
            <div className="flex1 truncate">
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>{f.name}</div>
              <div className="muted truncate" style={{ fontSize: 12 }}>{f.status.emoji} {f.status.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActiveRoomsCard({ setRoute }) {
  const myRooms = ROOMS;
  return (
    <div className="card">
      <div className="card-hd">
        <h3>Your rooms</h3>
        <span className="card-hd-action">New room +</span>
      </div>
      <div className="col gap-3">
        {myRooms.map(r => {
          const me = myRoomPct(r);
          const all = roomPct(r);
          return (
            <div key={r.id} className="col gap-2" style={{ padding: 8, borderRadius: 10, cursor: 'default' }} onClick={() => setRoute({ name: 'room', id: r.id })}>
              <div className="row gap-3">
                <div style={{
                  width: 32, height: 32, borderRadius: 9, display: 'grid', placeItems: 'center',
                  background: 'var(--bg-subtle)', fontSize: 16,
                }}>{r.emoji}</div>
                <div className="flex1 truncate">
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{r.name}</div>
                  <div className="muted" style={{ fontSize: 11.5 }}>{r.members.length} members · {r.activeNow.length} active</div>
                </div>
                <MemberStack ids={r.members} size={20} max={3} />
              </div>
              <div className="row gap-3" style={{ paddingLeft: 44 }}>
                <div style={{ flex: 1 }}>
                  <Progress value={me} height={3} />
                </div>
                <span className="muted mono" style={{ fontSize: 11 }}>{me}% · room {all}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FriendFeedCard() {
  return (
    <div className="card">
      <div className="card-hd">
        <h3>Friend activity</h3>
      </div>
      <div className="col gap-3">
        {FRIEND_FEED.map(f => {
          const u = getUser(f.user);
          return (
            <div key={f.id} className="row gap-3">
              <Avatar user={u} size={28} onBg="bg" />
              <div className="flex1 truncate">
                <div style={{ fontSize: 13 }}>
                  <b style={{ fontWeight: 600 }}>{u.name.split(' ')[0]}</b>{' '}
                  <span className="muted">{f.text}</span>
                </div>
                <div className="muted truncate" style={{ fontSize: 11.5 }}>{f.meta} · {f.when}</div>
              </div>
              {f.kind === 'photo' && (
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: 'linear-gradient(135deg, #f4c98a, #d97757 70%, #6b3e1f)',
                }} />
              )}
              {f.kind === 'task' && <Icon name="check" size={14} style={{ color: 'var(--status-online)' }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Today page ─────────────────────────────────────────────────────────────
function TodayPage({ tasks, onToggle, onCompose }) {
  const today = tasks.filter(t => t.when === 'today');
  const done = today.filter(t => t.done);
  const todo = today.filter(t => !t.done);
  const date = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="view-narrow">
      <PageHeader eyebrow="Today" title={date} subtitle={`${todo.length} task${todo.length === 1 ? '' : 's'} remaining`}>
        <Button icon="plus" variant="accent" onClick={onCompose}>New task</Button>
      </PageHeader>

      <div className="col gap-6">
        <div>
          <div className="row" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>To do</span>
            <span className="muted" style={{ marginLeft: 'auto', fontSize: 12 }}>{todo.length}</span>
          </div>
          {todo.length === 0 ? (
            <Empty icon="check" title="All clear" hint="You’ve checked off every task for today. Treat yourself." />
          ) : (
            <div className="list">
              {todo.map(t => <TaskRow key={t.id} task={t} onToggle={onToggle} />)}
            </div>
          )}
        </div>

        {done.length > 0 && (
          <div>
            <div className="row" style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Completed</span>
              <span className="muted" style={{ marginLeft: 'auto', fontSize: 12 }}>{done.length}</span>
            </div>
            <div className="list">
              {done.map(t => <TaskRow key={t.id} task={t} onToggle={onToggle} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Plans page ─────────────────────────────────────────────────────────────
function PlansPage({ tasks, onToggle, onCompose }) {
  const groups = [
    { key: 'tomorrow', label: 'Tomorrow',  hint: 'Thu' },
    { key: 'fri',      label: 'Friday',    hint: 'Fri' },
    { key: 'sat',      label: 'Saturday',  hint: 'Sat' },
    { key: 'next',     label: 'Next week', hint: '' },
    { key: 'someday',  label: 'Someday',   hint: '' },
  ];
  const future = tasks.filter(t => t.when !== 'today');

  return (
    <div className="view-narrow">
      <PageHeader eyebrow="Plans" title="What’s next" subtitle="Everything coming up, grouped by when.">
        <Button icon="plus" variant="accent" onClick={onCompose}>New task</Button>
      </PageHeader>

      <div className="col gap-6">
        {groups.map(g => {
          const items = future.filter(t => t.when === g.key);
          if (items.length === 0) return null;
          return (
            <div key={g.key}>
              <div className="row" style={{ marginBottom: 8, gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{g.label}</span>
                <span className="muted" style={{ fontSize: 12 }}>{items.length}</span>
              </div>
              <div className="list">
                {items.map(t => <TaskRow key={t.id} task={t} onToggle={onToggle} showWhen />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { TaskRow, Dashboard, TodayPage, PlansPage, StreakCard, StatsCard, PartnersCard });
