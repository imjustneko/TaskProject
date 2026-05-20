// room-page.jsx — The hero feature: Shared Room

function RoomPage({ roomId, setRoute, me }) {
  const room = ROOMS.find(r => r.id === roomId);
  if (!room) return <Empty icon="room" title="Room not found" />;

  const [tasks, setTasks] = React.useState(room.tasks);
  const [chat, setChat] = React.useState(room.chat);
  const [draft, setDraft] = React.useState('');

  const toggleTask = (taskId) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, done: { ...t.done, me: !t.done.me } } : t
    ));
  };
  const send = () => {
    if (!draft.trim()) return;
    setChat(prev => [...prev, { id: 'm' + Date.now(), from: 'me', text: draft.trim(), time: nowTime() }]);
    setDraft('');
  };

  const total = tasks.length;
  const myDone = tasks.filter(t => t.done.me).length;
  const myPct = Math.round((myDone / Math.max(1, total)) * 100);

  // member rollup
  const memberRollup = room.members.map(mid => {
    const u = getUser(mid);
    const done = tasks.filter(t => t.done[mid]).length;
    return { user: u, id: mid, done, total, pct: Math.round((done / Math.max(1, total)) * 100) };
  }).sort((a, b) => b.pct - a.pct);

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px',
      gap: 0, height: '100%', overflow: 'hidden',
    }}>
      {/* LEFT: header + checklist */}
      <div style={{ overflow: 'auto', padding: '32px 36px 40px', minWidth: 0 }}>
        {/* Room hero header */}
        <div style={{
          padding: '20px 22px', marginBottom: 24,
          borderRadius: 18, background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
            <div style={{
              width: 60, height: 60, borderRadius: 14, flexShrink: 0,
              background: 'var(--bg-subtle)', display: 'grid', placeItems: 'center',
              fontSize: 28, border: '1px solid var(--border)',
            }}>{room.emoji}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="row gap-2" style={{ marginBottom: 6, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Room</div>
                {room.activeNow.length > 0 && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5, padding: '1px 8px',
                    borderRadius: 999, fontSize: 10.5, fontWeight: 600, color: 'var(--status-online)',
                    background: 'color-mix(in oklab, var(--status-online) 14%, transparent)',
                  }}>
                    <i style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--status-online)' }} />
                    {room.activeNow.length} active now
                  </span>
                )}
                <div className="row gap-2" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                  <Button size="sm" icon="users">Invite</Button>
                  <Button size="sm" variant="ghost" icon="more" />
                </div>
              </div>
              <h1 style={{ fontSize: 22, marginBottom: 6, letterSpacing: '-0.015em' }}>{room.name}</h1>
              <div className="muted" style={{ fontSize: 13.5 }}>{room.description}</div>
            </div>
          </div>
          <div className="row gap-2" style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            <MemberStack ids={room.members} size={24} max={6} />
            <span className="muted" style={{ fontSize: 12 }}>{room.members.length} members</span>
            <span className="muted" style={{ fontSize: 12, marginLeft: 'auto' }}>Created Mar 2025</span>
          </div>
        </div>

        {/* My progress strip */}
        <div className="card" style={{ marginBottom: 20, padding: 18 }}>
          <div className="row gap-3" style={{ marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Your progress</span>
            <span className="mono muted" style={{ fontSize: 12, marginLeft: 'auto' }}>{myDone}/{total}</span>
          </div>
          <Progress value={myPct} height={6} />
        </div>

        {/* Checklist */}
        <h3 style={{ marginBottom: 12 }}>Tasks</h3>
        <div className="card" style={{ padding: 0, marginBottom: 32 }}>
          {tasks.map((t, i) => {
            const doneCount = room.members.filter(m => t.done[m]).length;
            const pct = Math.round((doneCount / room.members.length) * 100);
            return (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                borderBottom: i === tasks.length - 1 ? 0 : '1px solid var(--border)',
              }}>
                <input
                  type="checkbox"
                  className="cb"
                  checked={!!t.done.me}
                  onChange={() => toggleTask(t.id)}
                />
                <div className="flex1">
                  <div style={{
                    fontSize: 14, fontWeight: 500, marginBottom: 6,
                    color: t.done.me ? 'var(--text-faint)' : 'var(--text)',
                    textDecoration: t.done.me ? 'line-through' : 'none',
                  }}>{t.title}</div>
                  <div className="row gap-2">
                    {room.members.map(m => (
                      <div key={m} title={getUser(m).name + (t.done[m] ? ' · done' : ' · not yet')} style={{
                        position: 'relative',
                        opacity: t.done[m] ? 1 : 0.32,
                        filter: t.done[m] ? 'none' : 'grayscale(0.6)',
                        transition: 'opacity 200ms, filter 200ms',
                      }}>
                        <Avatar user={getUser(m)} size={18} />
                        {t.done[m] && (
                          <span style={{
                            position: 'absolute', right: -2, bottom: -2,
                            width: 10, height: 10, borderRadius: '50%',
                            background: 'var(--status-online)',
                            display: 'grid', placeItems: 'center',
                            border: '1.5px solid var(--bg-elevated)',
                          }}>
                            <Icon name="check" size={6} color="#fff" />
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ width: 92, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Progress value={pct} height={3} />
                </div>
                <span className="mono muted" style={{ fontSize: 11.5, width: 40, textAlign: 'right' }}>{doneCount}/{room.members.length}</span>
              </div>
            );
          })}
        </div>

        {/* Member leaderboard */}
        <h3 style={{ marginBottom: 12 }}>Member progress</h3>
        <div className="card" style={{ padding: 0 }}>
          {memberRollup.map((m, i) => (
            <div key={m.id} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px',
              borderBottom: i === memberRollup.length - 1 ? 0 : '1px solid var(--border)',
            }}>
              <span className="mono muted" style={{ fontSize: 11, width: 18 }}>{i + 1}</span>
              <Avatar user={m.user} size={28} status onBg="bg" />
              <div className="flex1">
                <div style={{ fontSize: 13.5, fontWeight: 500 }}>{m.user.name}{m.id === 'me' && <span className="muted" style={{ fontWeight: 400 }}> · you</span>}</div>
              </div>
              <div style={{ width: 200 }}>
                <Progress value={m.pct} height={4} />
              </div>
              <span className="mono muted" style={{ fontSize: 12, width: 38, textAlign: 'right' }}>{m.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: chat panel */}
      <div style={{
        borderLeft: '1px solid var(--border)',
        background: 'var(--bg-subtle)',
        display: 'flex', flexDirection: 'column',
        minWidth: 0,
      }}>
        <div style={{
          height: 52, flexShrink: 0,
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', padding: '0 16px',
          gap: 10, background: 'var(--bg)',
        }}>
          <Icon name="hash" size={16} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontWeight: 600, fontSize: 13.5 }}>Room chat</span>
          <span className="muted" style={{ fontSize: 12, marginLeft: 'auto' }}>{room.members.length}</span>
        </div>

        {/* Member list */}
        <div style={{ padding: '14px 16px 6px' }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-faint)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
            Members · {room.members.length}
          </div>
          <div className="col gap-1">
            {room.members.map(m => {
              const u = getUser(m);
              const isActive = room.activeNow.includes(m);
              return (
                <div key={m} className="row gap-2" style={{ padding: '5px 6px', borderRadius: 6, fontSize: 12.5 }}>
                  <Avatar user={u} size={22} status onBg="subtle" />
                  <span style={{ flex: 1, color: isActive ? 'var(--text)' : 'var(--text-muted)' }}>
                    {u.name}{m === 'me' && ' (you)'}
                  </span>
                  {isActive && <span style={{ fontSize: 10.5, color: 'var(--status-online)' }}>active</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--border)', margin: '6px 16px' }} />

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 8px', minHeight: 0 }}>
          {chat.map((m, i) => {
            const u = getUser(m.from);
            const prev = chat[i - 1];
            const grouped = prev && prev.from === m.from;
            return (
              <div key={m.id} className="row" style={{ alignItems: 'flex-start', gap: 10, marginTop: grouped ? 2 : 12 }}>
                <div style={{ width: 28, flexShrink: 0 }}>
                  {!grouped && <Avatar user={u} size={28} />}
                </div>
                <div className="flex1 truncate" style={{ overflow: 'visible' }}>
                  {!grouped && (
                    <div className="row gap-2" style={{ marginBottom: 2 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 600 }}>{u.name.split(' ')[0]}{m.from === 'me' && ' (you)'}</span>
                      <span className="muted mono" style={{ fontSize: 10.5 }}>{m.time}</span>
                    </div>
                  )}
                  <div style={{ fontSize: 13, color: 'var(--text-soft)', lineHeight: 1.45 }}>{m.text}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Composer */}
        <div style={{ padding: '10px 12px 14px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            border: '1px solid var(--border-strong)', borderRadius: 12,
            background: 'var(--bg-elevated)', padding: '4px 4px 4px 12px',
          }}>
            <input
              className="input"
              style={{ border: 0, height: 32, padding: 0, background: 'transparent' }}
              placeholder={`Message ${room.name}`}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <Button size="sm" variant="ghost" icon="paperclip" />
            <Button size="sm" variant="ghost" icon="image" />
            <Button size="sm" variant="accent" icon="send" onClick={send} />
          </div>
        </div>
      </div>
    </div>
  );
}

function nowTime() {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

Object.assign(window, { RoomPage });
