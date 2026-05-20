// modals.jsx — Create task, Status update, Login screen

// ── Create Task Modal ──────────────────────────────────────────────────────
function CreateTaskModal({ open, onClose, onCreate }) {
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [when, setWhen] = React.useState('today');
  const [time, setTime] = React.useState('');
  const [category, setCategory] = React.useState('Personal');
  const [priority, setPriority] = React.useState('med');
  const [shared, setShared] = React.useState(false);
  const [photo, setPhoto] = React.useState(false);

  const reset = () => {
    setTitle(''); setDesc(''); setWhen('today'); setTime('');
    setCategory('Personal'); setPriority('med'); setShared(false); setPhoto(false);
  };

  const save = () => {
    if (!title.trim()) return;
    onCreate({
      id: 't' + Date.now(),
      title: title.trim(), desc, when, time: time || null,
      category, priority, shared, photo, done: false,
      date: when === 'today' ? null : ({ tomorrow: 'Thu', fri: 'Fri', sat: 'Sat', next: 'Next week', someday: 'Someday' }[when] || ''),
    });
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="New task">
      <div className="col gap-4">
        <input
          className="input"
          style={{ fontSize: 15, height: 40, fontWeight: 500 }}
          placeholder="What’s the task?"
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          className="textarea"
          placeholder="Notes (optional)"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          rows={3}
        />

        <div className="grid-2">
          <div className="field">
            <label className="field-label">When</label>
            <select className="select input" value={when} onChange={e => setWhen(e.target.value)}>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="fri">This Friday</option>
              <option value="sat">This Saturday</option>
              <option value="next">Next week</option>
              <option value="someday">Someday</option>
            </select>
          </div>
          <div className="field">
            <label className="field-label">Time</label>
            <input className="input" type="time" value={time} onChange={e => setTime(e.target.value)} />
          </div>
        </div>

        <div className="grid-2">
          <div className="field">
            <label className="field-label">Category</label>
            <select className="select input" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="field-label">Priority</label>
            <div className="row gap-2">
              {[
                { k: 'high', label: 'High' },
                { k: 'med',  label: 'Medium' },
                { k: 'low',  label: 'Low' },
              ].map(p => (
                <button key={p.k} className="btn btn-sm" onClick={() => setPriority(p.k)} style={{
                  flex: 1,
                  borderColor: priority === p.k ? 'var(--accent)' : 'var(--border-strong)',
                  background: priority === p.k ? 'var(--accent-tint)' : 'var(--bg-elevated)',
                  color: priority === p.k ? 'var(--accent)' : 'var(--text-soft)',
                }}>
                  <PriorityDot level={p.k} /> {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
          <label className="row gap-2" style={{ cursor: 'default' }}>
            <input type="checkbox" className="cb cb-square" checked={shared} onChange={e => setShared(e.target.checked)} />
            <span style={{ fontSize: 13 }}>Share with friends</span>
          </label>
          <label className="row gap-2" style={{ cursor: 'default' }}>
            <input type="checkbox" className="cb cb-square" checked={photo} onChange={e => setPhoto(e.target.checked)} />
            <span style={{ fontSize: 13 }}>Save as daily memory <span className="muted">(photo on completion)</span></span>
          </label>
        </div>

        <div className="row" style={{ justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="accent" icon="check" onClick={save} disabled={!title.trim()}>Add task</Button>
        </div>
      </div>
    </Modal>
  );
}

// ── Status Update Modal ────────────────────────────────────────────────────
function StatusModal({ open, onClose, onUpdate, current }) {
  const [picked, setPicked] = React.useState(current.key);
  const [custom, setCustom] = React.useState(current.key === 'custom' ? current.label : '');
  const [customEmoji, setCustomEmoji] = React.useState('💭');

  const save = () => {
    if (picked === 'custom') {
      onUpdate({ key: 'custom', label: custom || 'Doing my thing', emoji: customEmoji, presence: 'online' });
    } else {
      const s = STATUSES.find(s => s.key === picked);
      onUpdate({ ...s, presence: 'online' });
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Update status">
      <div className="muted" style={{ fontSize: 13.5, marginBottom: 16 }}>What are you up to right now? Friends will see this.</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
        {STATUSES.map(s => (
          <button key={s.key} onClick={() => setPicked(s.key)} className="btn" style={{
            height: 76, flexDirection: 'column', gap: 6, padding: 8,
            borderColor: picked === s.key ? 'var(--accent)' : 'var(--border-strong)',
            background: picked === s.key ? 'var(--accent-tint)' : 'var(--bg-elevated)',
          }}>
            <span style={{ fontSize: 22 }}>{s.emoji}</span>
            <span style={{ fontSize: 11.5, color: 'var(--text-soft)' }}>{s.label}</span>
          </button>
        ))}
      </div>

      <div className="field" style={{ marginBottom: 16 }}>
        <label className="field-label">Or write your own</label>
        <div className="row gap-2">
          <input className="input" style={{ width: 56, textAlign: 'center', fontSize: 18 }}
            value={customEmoji} onChange={e => setCustomEmoji(e.target.value.slice(0, 2))} />
          <input className="input flex1" placeholder="e.g. Sipping coffee, planning the day"
            value={custom} onFocus={() => setPicked('custom')} onChange={e => setCustom(e.target.value)} />
        </div>
      </div>

      <div className="row" style={{ justifyContent: 'space-between' }}>
        <Button variant="ghost" onClick={() => { onUpdate(null); onClose(); }}>Clear status</Button>
        <div className="row gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="accent" onClick={save}>Update</Button>
        </div>
      </div>
    </Modal>
  );
}

// ── Login / Register screen ────────────────────────────────────────────────
function LoginScreen({ onAuth }) {
  const [mode, setMode] = React.useState('login');
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [name, setName] = React.useState('');

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100vh',
      background: 'var(--bg)',
    }}>
      {/* Left — brand panel */}
      <div style={{
        background: 'linear-gradient(160deg, #ffe9dc 0%, #fff5ec 50%, #fafaf7 100%)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', padding: '48px 56px',
      }}>
        <div className="row gap-2" style={{ fontSize: 18, fontWeight: 600 }}>
          <div className="side-brand-mark" style={{ width: 32, height: 32, fontSize: 14 }}>T</div>
          Taskyy
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15, color: '#2a1a14', maxWidth: 440 }}>
            Get things done, together.
          </div>
          <div style={{ fontSize: 15, color: '#6b4530', marginTop: 16, maxWidth: 420, lineHeight: 1.5 }}>
            A calm place for daily tasks, shared rooms, and showing friends what you’re up to.
          </div>

          {/* Sample chips for visual */}
          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 380 }}>
            {[
              { e: '☀️', t: 'Morning Pages', s: '3 friends writing now' },
              { e: '📖', t: 'Slow Reads · Demon Copperhead', s: 'Chapter 10 due Friday' },
              { e: '🏃', t: 'Couch to 5K', s: 'Priya finished Run 2' },
            ].map((c, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12, alignItems: 'center',
                padding: '12px 14px', borderRadius: 12,
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.9)',
                boxShadow: '0 4px 20px rgba(135, 70, 30, 0.06)',
                backdropFilter: 'blur(8px)',
              }}>
                <div style={{ fontSize: 22 }}>{c.e}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#2a1a14' }}>{c.t}</div>
                  <div style={{ fontSize: 11.5, color: '#6b4530' }}>{c.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 'auto', fontSize: 12, color: '#8a6648', paddingTop: 32 }}>
          © Taskyy 2026 · Built for calm productivity
        </div>
      </div>

      {/* Right — auth form */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 80px',
      }}>
        <div style={{ maxWidth: 380, margin: '0 auto', width: '100%' }}>
          <h1 style={{ fontSize: 26, marginBottom: 6 }}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <div className="muted" style={{ fontSize: 14, marginBottom: 28 }}>
            {mode === 'login' ? 'Pick up where you left off.' : 'It only takes a moment.'}
          </div>

          <div className="col gap-3">
            {mode === 'register' && (
              <div className="field">
                <label className="field-label">Display name</label>
                <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Mira Tanaka" />
              </div>
            )}
            <div className="field">
              <label className="field-label">Email</label>
              <input className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@taskyy.app" />
            </div>
            <div className="field">
              <label className="field-label">Password</label>
              <input className="input" type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" />
              {mode === 'login' && (
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>
                  Forgot password?
                </div>
              )}
            </div>
          </div>

          <Button variant="accent" size="lg" style={{ width: '100%', marginTop: 20 }} onClick={onAuth}>
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </Button>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0',
            color: 'var(--text-faint)', fontSize: 12,
          }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            or
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <div className="col gap-2">
            <Button size="lg" style={{ width: '100%' }} onClick={onAuth}>Continue with Google</Button>
            <Button size="lg" style={{ width: '100%' }} onClick={onAuth}>Continue with Apple</Button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 28, fontSize: 13, color: 'var(--text-muted)' }}>
            {mode === 'login' ? "Don’t have an account? " : "Already have an account? "}
            <a onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
               style={{ color: 'var(--accent)', fontWeight: 500, cursor: 'default' }}>
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CreateTaskModal, StatusModal, LoginScreen });
