// app.jsx — Root app, routing, tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#ff6b35",
  "dark": false,
  "density": "regular",
  "showLogin": false,
  "adminMode": false
}/*EDITMODE-END*/;

function applyAccent(hex) {
  document.documentElement.style.setProperty('--accent', hex);
  // tint = same color at ~10% alpha
  const h = hex.replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  document.documentElement.style.setProperty('--accent-tint', `rgba(${r}, ${g}, ${b}, 0.10)`);
  document.documentElement.style.setProperty('--accent-tint-strong', `rgba(${r}, ${g}, ${b}, 0.18)`);
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = React.useState({ name: 'dashboard' });
  const [tasks, setTasks] = React.useState(() => makeTasks());
  const [me, setMe] = React.useState(ME);
  const [composeOpen, setComposeOpen] = React.useState(false);
  const [statusOpen, setStatusOpen] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(t.showLogin);
  const [adminMode, setAdminMode] = React.useState(t.adminMode);

  // When admin mode toggles, snap route to a sensible default
  React.useEffect(() => {
    setAdminMode(t.adminMode);
    setRoute(t.adminMode ? { name: 'admin-dashboard' } : { name: 'dashboard' });
  }, [t.adminMode]);

  // Apply theme + density + accent
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.dark ? 'dark' : 'light');
  }, [t.dark]);
  React.useEffect(() => {
    document.documentElement.setAttribute('data-density', t.density);
  }, [t.density]);
  React.useEffect(() => applyAccent(t.accent), [t.accent]);
  React.useEffect(() => setShowLogin(t.showLogin), [t.showLogin]);

  // Keyboard: N to compose, Esc to close
  React.useEffect(() => {
    const onKey = (e) => {
      const inField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
      if (e.key.toLowerCase() === 'n' && !inField && !composeOpen) {
        e.preventDefault();
        setComposeOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [composeOpen]);

  const toggleTask = (id) => setTasks(prev => prev.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const addTask = (newTask) => setTasks(prev => [newTask, ...prev]);
  const updateMe = (patch) => setMe(prev => ({ ...prev, ...patch }));
  const updateStatus = (status) => setMe(prev => ({ ...prev, status: status || { key: 'none', label: 'Available', emoji: '◌', presence: 'online' } }));

  // -- Render

  if (showLogin) {
    return (
      <>
        <LoginScreen onAuth={() => { setShowLogin(false); setTweak('showLogin', false); }} />
        <TweaksPanelMain t={t} setTweak={setTweak} setShowLogin={setShowLogin} />
      </>
    );
  }

  const topbarTitleMap = {
    dashboard: 'Home',
    today: 'Today',
    plans: 'Plans',
    friends: 'Friends',
    friend: 'Friend',
    room: 'Room',
    profile: 'Profile',
    'admin-dashboard': 'Admin',
    'admin-users':     'Admin',
    'admin-reports':   'Admin',
    'admin-rooms':     'Admin',
    'admin-content':   'Admin',
    'admin-settings':  'Admin',
  };

  let title = topbarTitleMap[route.name];
  let crumb = null;
  if (route.name === 'friend') {
    const u = getUser(route.id);
    crumb = u?.name;
  } else if (route.name === 'room') {
    const r = ROOMS.find(x => x.id === route.id);
    crumb = r?.name;
  } else if (route.name.startsWith('admin-')) {
    crumb = { 'admin-dashboard': 'Overview', 'admin-users': 'Users', 'admin-reports': 'Reports', 'admin-rooms': 'Rooms', 'admin-content': 'Content', 'admin-settings': 'Settings' }[route.name];
  }

  return (
    <>
      <div className="app">
        {adminMode ? (
          <AdminSidebar
            route={route}
            setRoute={setRoute}
            onExit={() => { setTweak('adminMode', false); }}
          />
        ) : (
          <Sidebar
            route={route}
            setRoute={setRoute}
            onCompose={() => setComposeOpen(true)}
            onStatus={() => setStatusOpen(true)}
          />
        )}
        <div className="main">
          <Topbar
            title={title}
            crumb={crumb}
            onSearch={() => {}}
            onToggleTheme={() => setTweak('dark', !t.dark)}
            dark={t.dark}
          >
            {!adminMode && (
              <Button size="sm" icon="sparkle" onClick={() => setStatusOpen(true)}>
                <span style={{ marginLeft: -2, marginRight: 2 }}>{me.status.emoji}</span>
                <span className="truncate" style={{ maxWidth: 140 }}>{me.status.label}</span>
              </Button>
            )}
            {adminMode && (
              <Badge tone="warn" dot>Admin mode</Badge>
            )}
          </Topbar>

          <div className={route.name === 'room' ? '' : 'view'} style={route.name === 'room' ? { flex: 1, overflow: 'hidden' } : {}}>
            <div key={route.name + (route.id || '')}>
              {route.name === 'dashboard' && (
                <Dashboard tasks={tasks} onToggle={toggleTask} onCompose={() => setComposeOpen(true)} setRoute={setRoute} />
              )}
              {route.name === 'today' && (
                <TodayPage tasks={tasks} onToggle={toggleTask} onCompose={() => setComposeOpen(true)} />
              )}
              {route.name === 'plans' && (
                <PlansPage tasks={tasks} onToggle={toggleTask} onCompose={() => setComposeOpen(true)} />
              )}
              {route.name === 'feed' && (
                <FeedPage setRoute={setRoute} />
              )}
              {route.name === 'report' && (
                <ReportPage />
              )}
              {route.name === 'partners' && (
                <PartnersPage setRoute={setRoute} />
              )}
              {route.name === 'labels' && (
                <LabelsPage />
              )}
              {route.name === 'friends' && (
                <FriendsPage setRoute={setRoute} />
              )}
              {route.name === 'friend' && (
                <FriendProfile id={route.id} setRoute={setRoute} tasks={tasks} />
              )}
              {route.name === 'room' && (
                <RoomPage roomId={route.id} setRoute={setRoute} me={me} />
              )}
              {route.name === 'profile' && (
                <ProfilePage me={me} onUpdate={updateMe} onStatus={() => setStatusOpen(true)} />
              )}
              {route.name === 'admin-dashboard' && <AdminDashboard setRoute={setRoute} />}
              {route.name === 'admin-users'     && <AdminUsersPage />}
              {route.name === 'admin-reports'   && <AdminReportsPage />}
              {route.name === 'admin-rooms'     && <AdminPlaceholder title="Rooms"    icon="room" />}
              {route.name === 'admin-content'   && <AdminPlaceholder title="Content"  icon="archive" />}
              {route.name === 'admin-settings'  && <AdminPlaceholder title="Settings" icon="settings" />}
            </div>
          </div>
        </div>
      </div>

      <CreateTaskModal open={composeOpen} onClose={() => setComposeOpen(false)} onCreate={addTask} />
      <StatusModal open={statusOpen} onClose={() => setStatusOpen(false)} onUpdate={updateStatus} current={me.status} />

      <TweaksPanelMain t={t} setTweak={setTweak} setShowLogin={setShowLogin} />
    </>
  );
}

function TweaksPanelMain({ t, setTweak, setShowLogin }) {
  return (
    <TweaksPanel title="Taskyy tweaks">
      <TweakSection label="Theme">
        <TweakToggle label="Dark mode" value={t.dark} onChange={v => setTweak('dark', v)} />
        <TweakColor
          label="Accent"
          value={t.accent}
          options={['#ff6b35', '#ea580c', '#f97316', '#0ea5e9', '#7c3aed', '#10b981', '#ec4899', '#14141a']}
          onChange={v => setTweak('accent', v)}
        />
        <TweakRadio
          label="Density"
          value={t.density}
          options={['compact', 'regular', 'comfy']}
          onChange={v => setTweak('density', v)}
        />
      </TweakSection>
      <TweakSection label="Show">
        <TweakToggle label="Admin panel" value={t.adminMode} onChange={(v) => setTweak('adminMode', v)} />
        <TweakToggle label="Login screen" value={t.showLogin} onChange={(v) => { setTweak('showLogin', v); setShowLogin(v); }} />
        <TweakButton label="Open design plan ↗" secondary onClick={() => window.open('design-plan.html', '_blank')} />
      </TweakSection>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
