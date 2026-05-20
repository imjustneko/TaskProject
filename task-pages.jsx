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
          <FriendsStatusCard setRoute={setRoute} />
          <ActiveRoomsCard setRoute={setRoute} />
          <FriendFeedCard />
        </div>
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

Object.assign(window, { TaskRow, Dashboard, TodayPage, PlansPage });
