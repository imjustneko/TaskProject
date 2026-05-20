// social-pages.jsx — Friends, Friend profile, Profile edit pages

// ── Friends page ───────────────────────────────────────────────────────────
function FriendsPage({ setRoute }) {
  const [q, setQ] = React.useState('');
  const [tab, setTab] = React.useState('all');
  const filtered = FRIENDS.filter(f =>
    !q || f.name.toLowerCase().includes(q.toLowerCase()) || f.handle.toLowerCase().includes(q.toLowerCase())
  );
  const online = filtered.filter(f => f.presence === 'online');
  const list = tab === 'online' ? online : filtered;

  return (
    <div>
      <PageHeader eyebrow="Friends" title="Your circle" subtitle="People you do tasks and rooms with.">
        <Button icon="plus">Add by handle</Button>
      </PageHeader>

      {/* Search + tabs */}
      <div className="row gap-3" style={{ marginBottom: 20 }}>
        <div className="input-search flex1">
          <Icon name="search" size={14} />
          <input className="input" placeholder="Search by name or @handle" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <div style={{
          display: 'inline-flex', background: 'var(--bg-subtle)', borderRadius: 8, padding: 2,
          border: '1px solid var(--border)',
        }}>
          {[
            { k: 'all', label: `All · ${filtered.length}` },
            { k: 'online', label: `Online · ${online.length}` },
          ].map(t => (
            <button key={t.k} className="btn btn-sm" style={{
              border: 0, height: 26, padding: '0 10px',
              background: tab === t.k ? 'var(--bg-elevated)' : 'transparent',
              color: tab === t.k ? 'var(--text)' : 'var(--text-muted)',
              boxShadow: tab === t.k ? 'var(--shadow-1)' : 'none',
            }} onClick={() => setTab(t.k)}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Friend requests */}
      {FRIEND_REQUESTS.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-hd">
            <h3>Requests</h3>
            <Badge tone="accent">{FRIEND_REQUESTS.length} pending</Badge>
          </div>
          <div className="col gap-3">
            {FRIEND_REQUESTS.map(r => (
              <div key={r.id} className="row gap-3">
                <Avatar user={r.from} size={36} />
                <div className="flex1">
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{r.from.name} <span className="muted" style={{ fontWeight: 400 }}>{r.from.handle}</span></div>
                  <div className="muted" style={{ fontSize: 12 }}>{r.from.bio} · {r.mutuals} mutual · {r.when}</div>
                </div>
                <Button size="sm" variant="primary">Accept</Button>
                <Button size="sm">Decline</Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {list.map(f => (
          <div key={f.id} className="card" style={{ padding: 18, cursor: 'default' }} onClick={() => setRoute({ name: 'friend', id: f.id })}>
            <div className="row gap-3" style={{ marginBottom: 12 }}>
              <Avatar user={f} size={40} status onBg="bg" />
              <div className="flex1 truncate">
                <div style={{ fontSize: 14, fontWeight: 600 }}>{f.name}</div>
                <div className="muted truncate" style={{ fontSize: 12 }}>{f.handle} · {f.mutuals} mutual</div>
              </div>
            </div>
            <div className="muted" style={{ fontSize: 12.5, marginBottom: 12, minHeight: 36 }}>{f.bio}</div>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <StatusPill status={f.status} compact />
              <Button size="sm" variant="ghost" icon="send" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Friend profile (clicked from list) ─────────────────────────────────────
function FriendProfile({ id, setRoute, tasks }) {
  const u = getUser(id);
  const sharedRooms = ROOMS.filter(r => r.members.includes(id));
  const sharedTasks = tasks.filter(t => t.shared).slice(0, 3);

  return (
    <div className="view-narrow">
      <div className="row" style={{ marginBottom: 24 }}>
        <Button size="sm" variant="ghost" icon="chevron-right" style={{ transform: 'scaleX(-1)' }} onClick={() => setRoute({ name: 'friends' })}>Friends</Button>
      </div>

      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: 18, overflow: 'hidden', marginBottom: 24,
      }}>
        <div style={{
          height: 100,
          background: `linear-gradient(135deg, ${hueFor(u.name)}, color-mix(in oklab, ${hueFor(u.name)} 40%, #fafaf7))`,
        }} />
        <div style={{ padding: '0 24px 24px', marginTop: -28 }}>
          <div className="row" style={{ alignItems: 'flex-end', gap: 16 }}>
            <div style={{ borderRadius: '50%', boxShadow: '0 0 0 4px var(--bg-elevated)' }}>
              <Avatar user={u} size={72} status onBg="bg" />
            </div>
            <div className="flex1" style={{ paddingBottom: 6 }}>
              <h1 style={{ fontSize: 22 }}>{u.name}</h1>
              <div className="muted" style={{ fontSize: 13 }}>{u.handle} · {u.mutuals} mutual friends</div>
            </div>
            <Button icon="send">Message</Button>
            <Button variant="primary" icon="plus">Invite to room</Button>
          </div>
          <div style={{ marginTop: 16, fontSize: 14, color: 'var(--text-soft)' }}>{u.bio}</div>
          {u.status && (
            <div style={{ marginTop: 14 }}>
              <StatusPill status={u.status} />
            </div>
          )}
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-hd"><h3>Shared rooms</h3><span className="muted" style={{ fontSize: 12 }}>{sharedRooms.length}</span></div>
          <div className="col gap-3">
            {sharedRooms.map(r => (
              <div key={r.id} className="row gap-3" onClick={() => setRoute({ name: 'room', id: r.id })}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9, display: 'grid', placeItems: 'center',
                  background: 'var(--bg-subtle)', fontSize: 16,
                }}>{r.emoji}</div>
                <div className="flex1 truncate">
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{r.name}</div>
                  <div className="muted" style={{ fontSize: 11.5 }}>{r.members.length} members</div>
                </div>
                <Icon name="chevron-right" size={14} style={{ color: 'var(--text-faint)' }} />
              </div>
            ))}
            {sharedRooms.length === 0 && <Empty icon="room" title="No shared rooms yet" hint="Start a room and invite them in." />}
          </div>
        </div>

        <div className="card">
          <div className="card-hd"><h3>Public tasks</h3></div>
          <div className="list">
            {sharedTasks.map(t => (
              <div key={t.id} className="list-row">
                <input type="checkbox" className="cb" checked={t.done} readOnly />
                <PriorityDot level={t.priority} />
                <div className="flex1 truncate" style={{ fontSize: 13.5 }}>{t.title}</div>
                <CategoryTag category={t.category} />
              </div>
            ))}
            {sharedTasks.length === 0 && <Empty icon="lock" title="Nothing public" hint="Friends only see tasks they’ve marked as shared." />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Profile edit page ──────────────────────────────────────────────────────
function ProfilePage({ me, onUpdate, onStatus }) {
  const [name, setName] = React.useState(me.name);
  const [handle, setHandle] = React.useState(me.handle);
  const [bio, setBio] = React.useState(me.bio);

  return (
    <div className="view-narrow">
      <PageHeader eyebrow="You" title="Profile" subtitle="How you appear to friends in Taskyy." />

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="row gap-4" style={{ marginBottom: 22 }}>
          <Avatar user={me} size={64} status onBg="bg" />
          <div className="flex1">
            <div style={{ fontSize: 15, fontWeight: 600 }}>{me.name}</div>
            <div className="muted" style={{ fontSize: 12.5, marginBottom: 8 }}>Joined {me.joined}</div>
            <div className="row gap-2">
              <Button size="sm" icon="image">Change photo</Button>
              <Button size="sm" variant="ghost">Remove</Button>
            </div>
          </div>
          <div style={{ alignSelf: 'flex-start' }}>
            <Button onClick={onStatus} icon="sparkle">Update status</Button>
          </div>
        </div>

        <div className="col gap-4">
          <div className="grid-2">
            <div className="field">
              <label className="field-label">Display name</label>
              <input className="input" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label">Handle</label>
              <input className="input" value={handle} onChange={e => setHandle(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label className="field-label">Bio</label>
            <textarea className="textarea" value={bio} onChange={e => setBio(e.target.value)} />
          </div>
          <div className="row gap-2" style={{ justifyContent: 'flex-end' }}>
            <Button>Cancel</Button>
            <Button variant="primary" onClick={() => onUpdate({ name, handle, bio })}>Save changes</Button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 6 }}>Privacy</h3>
        <div className="muted" style={{ fontSize: 13, marginBottom: 16 }}>Control what friends can see by default.</div>
        <div className="col gap-3">
          {[
            { k: 'status', label: 'Show my live status', val: true,  hint: 'Friends can see what you’re up to right now.' },
            { k: 'tasks',  label: 'Share shared tasks',  val: true,  hint: 'Tasks marked shared appear on your profile feed.' },
            { k: 'photos', label: 'Daily memory photos', val: false, hint: 'Photos attached to tasks stay private unless turned on.' },
            { k: 'online', label: 'Show online indicator', val: true, hint: 'A green dot next to your avatar when you’re active.' },
          ].map(p => (
            <div key={p.k} className="row" style={{
              padding: '10px 0', borderBottom: '1px solid var(--border)',
            }}>
              <div className="flex1">
                <div style={{ fontSize: 13.5, fontWeight: 500 }}>{p.label}</div>
                <div className="muted" style={{ fontSize: 12 }}>{p.hint}</div>
              </div>
              <Toggle value={p.val} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Toggle({ value }) {
  const [v, setV] = React.useState(value);
  return (
    <button onClick={() => setV(!v)} style={{
      width: 36, height: 22, borderRadius: 999, border: 0, padding: 0,
      background: v ? 'var(--accent)' : 'var(--border-strong)',
      position: 'relative', cursor: 'default', transition: 'background 150ms',
    }}>
      <span style={{
        position: 'absolute', top: 2, left: v ? 16 : 2,
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 150ms',
      }} />
    </button>
  );
}

Object.assign(window, { FriendsPage, FriendProfile, ProfilePage, Toggle });
