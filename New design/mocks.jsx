// mocks.jsx — Mock data for Taskyy prototype

// Stable seeded palette for avatar fallbacks
const AVATAR_HUES = ['#f97316', '#0ea5e9', '#10b981', '#a855f7', '#ec4899', '#f59e0b', '#06b6d4', '#84cc16', '#e11d48'];
function hueFor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_HUES[h % AVATAR_HUES.length];
}

const STATUSES = [
  { key: 'gaming',   label: 'Playing game',   emoji: '🎮' },
  { key: 'cooking',  label: 'Cooking',        emoji: '🍳' },
  { key: 'walking',  label: 'Walking',        emoji: '🚶' },
  { key: 'studying', label: 'Studying',       emoji: '📚' },
  { key: 'reading',  label: 'Reading',        emoji: '📖' },
  { key: 'working',  label: 'Working',        emoji: '💻' },
  { key: 'resting',  label: 'Resting',        emoji: '🌙' },
  { key: 'workout',  label: 'Working out',    emoji: '🏃' },
];

const ME = {
  id: 'me',
  name: 'Mira Tanaka',
  handle: '@mira',
  bio: 'Designer, runner, slow-bread enthusiast. Trying to read more this year.',
  joined: 'Mar 2025',
  status: { key: 'working', label: 'Designing Taskyy', emoji: '💻', presence: 'online' },
};

const FRIENDS = [
  { id: 'u1', name: 'Asher Khan',    handle: '@asher',   bio: 'iOS engineer · Brooklyn',     presence: 'online',  status: { key: 'gaming',   label: 'Elden Ring',          emoji: '🎮' }, mutuals: 7 },
  { id: 'u2', name: 'Liora Bennett', handle: '@liora',   bio: 'PhD student · sleep nerd',    presence: 'online',  status: { key: 'studying', label: 'Stats midterm',       emoji: '📚' }, mutuals: 4 },
  { id: 'u3', name: 'Felix Moreau',  handle: '@felix',   bio: 'Bread, coffee, photos',       presence: 'busy',    status: { key: 'cooking',  label: 'Sourdough day',       emoji: '🍳' }, mutuals: 12 },
  { id: 'u4', name: 'Priya Rao',     handle: '@priya',   bio: 'Designer @ Crescent',         presence: 'online',  status: { key: 'walking',  label: 'On a walk · 32 min',  emoji: '🚶' }, mutuals: 9 },
  { id: 'u5', name: 'Theo Park',     handle: '@theo',    bio: 'Composer / dad of two',       presence: 'idle',    status: { key: 'reading',  label: 'Demon Copperhead',    emoji: '📖' }, mutuals: 2 },
  { id: 'u6', name: 'Maren Holst',   handle: '@maren',   bio: 'Climbing & cats',             presence: 'offline', status: null, mutuals: 3 },
  { id: 'u7', name: 'Sam Okafor',    handle: '@sam',     bio: 'Backend @ Plume',             presence: 'online',  status: { key: 'working',  label: 'Shipping migrations', emoji: '💻' }, mutuals: 6 },
  { id: 'u8', name: 'Yuki Mori',     handle: '@yuki',    bio: 'Ceramicist',                  presence: 'busy',    status: { key: 'workout',  label: 'Long run',            emoji: '🏃' }, mutuals: 1 },
];

const FRIEND_REQUESTS = [
  { id: 'r1', from: { id: 'p1', name: 'Eleni Roussos', handle: '@eleni', bio: 'Type designer · Athens' }, mutuals: 2, when: '2h' },
  { id: 'r2', from: { id: 'p2', name: 'Bear Williams', handle: '@bear',  bio: 'Trail runner · Bend, OR' }, mutuals: 1, when: 'yesterday' },
];

// Tasks — mixed today / future / done
function makeTasks() {
  return [
    { id: 't1', title: 'Review the Taskyy onboarding flow', category: 'Design',   priority: 'high',   when: 'today',  time: '09:30', done: true,  shared: false },
    { id: 't2', title: 'Sketch the room invite screen',     category: 'Design',   priority: 'med',    when: 'today',  time: '11:00', done: true,  shared: false },
    { id: 't3', title: 'Run · 5km easy along the river',    category: 'Health',   priority: 'med',    when: 'today',  time: '17:30', done: false, shared: true,  photo: true },
    { id: 't4', title: 'Read · Chapter 8 of Demon Copperhead', category: 'Reading', priority: 'low',  when: 'today',  time: '21:00', done: false, shared: true,  room: 'rm-2' },
    { id: 't5', title: 'Call Mom',                          category: 'Personal', priority: 'high',   when: 'today',  time: '19:00', done: false, shared: false },
    { id: 't6', title: 'Grocery run — bread, oat milk, eggs', category: 'Errands', priority: 'low',  when: 'today',  time: null,    done: false, shared: false },

    { id: 't7', title: 'Submit Q3 design review',            category: 'Work',    priority: 'high',  when: 'tomorrow', date: 'Thu', time: '14:00', done: false, shared: false },
    { id: 't8', title: 'Climbing session w/ Felix',         category: 'Health',   priority: 'med',   when: 'fri',      date: 'Fri', time: '18:00', done: false, shared: true },
    { id: 't9', title: 'Birthday gift for Asher',           category: 'Personal', priority: 'med',   when: 'sat',      date: 'Sat', time: null,    done: false, shared: false },
    { id: 't10', title: 'Plan Lisbon trip — flights + airbnb', category: 'Trips', priority: 'low',  when: 'next',     date: 'Next week', time: null,  done: false, shared: false },
    { id: 't11', title: 'Annual checkup',                   category: 'Health',   priority: 'med',   when: 'next',     date: 'Mar 14', time: '10:00', done: false, shared: false },
    { id: 't12', title: 'Read Hyperion',                    category: 'Reading',  priority: 'low',   when: 'someday',  date: 'Someday', time: null,   done: false, shared: false },
  ];
}

const CATEGORIES = [
  { key: 'Design',   color: '#a855f7' },
  { key: 'Work',     color: '#0ea5e9' },
  { key: 'Health',   color: '#10b981' },
  { key: 'Reading',  color: '#f59e0b' },
  { key: 'Personal', color: '#ec4899' },
  { key: 'Errands',  color: '#84cc16' },
  { key: 'Trips',    color: '#06b6d4' },
];

const ROOMS = [
  {
    id: 'rm-1',
    name: 'Morning Pages',
    emoji: '☀️',
    description: 'A quiet 25-min writing room every weekday before 9am.',
    members: ['me', 'u2', 'u4', 'u5'],
    activeNow: ['u2', 'u4'],
    tasks: [
      { id: 'rt1', title: '25-min freewrite',         done: { me: true,  u2: true,  u4: true,  u5: false } },
      { id: 'rt2', title: '3 lines of gratitude',     done: { me: true,  u2: true,  u4: false, u5: false } },
      { id: 'rt3', title: 'One sentence intention',   done: { me: false, u2: true,  u4: false, u5: false } },
    ],
    chat: [
      { id: 'm1', from: 'u4', text: 'morning ☀️', time: '8:02' },
      { id: 'm2', from: 'u2', text: 'okay starting now', time: '8:04' },
      { id: 'm3', from: 'me', text: 'rolling in 2 min — kettle on', time: '8:06' },
      { id: 'm4', from: 'u4', text: 'made it through the freewrite, brain feels like soup', time: '8:31' },
    ],
  },
  {
    id: 'rm-2',
    name: 'Slow Reads · Demon Copperhead',
    emoji: '📖',
    description: '3 chapters a week. No spoilers past where you are.',
    members: ['me', 'u1', 'u3', 'u5', 'u7'],
    activeNow: ['u5'],
    tasks: [
      { id: 'rt1', title: 'Chapter 8',  done: { me: false, u1: true,  u3: true,  u5: true,  u7: false } },
      { id: 'rt2', title: 'Chapter 9',  done: { me: false, u1: false, u3: true,  u5: true,  u7: false } },
      { id: 'rt3', title: 'Chapter 10', done: { me: false, u1: false, u3: false, u5: true,  u7: false } },
    ],
    chat: [
      { id: 'm1', from: 'u5', text: 'finished ch 10, the courtroom scene is brutal', time: '20:14' },
      { id: 'm2', from: 'u3', text: 'haven’t gotten there yet, hush', time: '20:15' },
      { id: 'm3', from: 'u5', text: 'sorry sorry 🙊', time: '20:15' },
    ],
  },
  {
    id: 'rm-3',
    name: 'Couch to 5K',
    emoji: '🏃',
    description: 'Week 4 of the program. Three runs a week, accountability check-ins.',
    members: ['me', 'u4', 'u8'],
    activeNow: [],
    tasks: [
      { id: 'rt1', title: 'Run 1 · 20 min easy',  done: { me: true,  u4: true,  u8: true  } },
      { id: 'rt2', title: 'Run 2 · intervals',    done: { me: false, u4: true,  u8: false } },
      { id: 'rt3', title: 'Run 3 · long run',     done: { me: false, u4: false, u8: false } },
    ],
    chat: [
      { id: 'm1', from: 'u4', text: 'done with run 2! intervals destroyed me', time: '6:42' },
      { id: 'm2', from: 'me', text: 'doing mine after work, you are inspiring', time: '7:10' },
    ],
  },
];

const NOTIFS = [
  { id: 'n1', text: 'Priya finished "Run 2 · intervals" in Couch to 5K', when: '12m' },
  { id: 'n2', text: 'Eleni Roussos sent you a friend request', when: '2h' },
  { id: 'n3', text: 'Theo posted progress in Slow Reads · Demon Copperhead', when: '5h' },
];

// Daily progress — last 14 days (for streak / stats viz)
const PROGRESS_HISTORY = [
  { d: -13, done: 4, total: 5 }, { d: -12, done: 6, total: 6 },
  { d: -11, done: 0, total: 0 }, { d: -10, done: 3, total: 4 },
  { d: -9,  done: 5, total: 5 }, { d: -8,  done: 4, total: 6 },
  { d: -7,  done: 2, total: 4 }, { d: -6,  done: 6, total: 6 },
  { d: -5,  done: 5, total: 5 }, { d: -4,  done: 4, total: 5 },
  { d: -3,  done: 3, total: 4 }, { d: -2,  done: 5, total: 6 },
  { d: -1,  done: 4, total: 5 }, { d: 0,   done: 2, total: 6 },
];

const STREAK = { current: 8, best: 21, weekly: [5, 4, 6, 5, 4, 5, 2] }; // last 7 days completed counts

const STATS = {
  today:  { done: 2, total: 6 },
  week:   { done: 38, total: 47 },
  total:  { done: 412 },
};

// Accountability partners — friends you've paired with for daily check-ins
const PARTNERS = [
  { pairId: 'p1', partnerId: 'u4', todayDone: 3, todayTotal: 4, streak: 12, jointStreak: 9, since: 'Feb 2025',
    pact: 'Run 3× a week · finish daily 3 tasks',
    spark: [0.6, 0.8, 1.0, 0.4, 1.0, 0.8, 0.6, 1.0, 0.8, 1.0, 0.6, 0.8, 1.0, 0.75] },
  { pairId: 'p2', partnerId: 'u2', todayDone: 2, todayTotal: 5, streak: 6, jointStreak: 4, since: 'Apr 2025',
    pact: 'Study 1 hour + 5 tasks every weekday',
    spark: [0.4, 0.6, 0.6, 0.8, 0.4, 0, 0, 0.6, 0.8, 0.4, 0.6, 0.8, 1.0, 0.4] },
  { pairId: 'p3', partnerId: 'u7', todayDone: 5, todayTotal: 5, streak: 18, jointStreak: 18, since: 'Jan 2025',
    pact: 'Ship a thing every Friday',
    spark: [0.8, 1.0, 1.0, 1.0, 1.0, 0.8, 1.0, 1.0, 1.0, 0.8, 1.0, 1.0, 1.0, 1.0] },
];

const PARTNER_REQUESTS = [
  { id: 'pr1', from: 'u1', pact: 'Climbing twice a week', when: '3h' },
];

// Labels — user-managed task tags
const LABELS = [
  { id: 'l1', name: 'Deep work',   color: '#7c3aed', count: 28, recent: ['Wireframe onboarding', 'Spec rooms API'] },
  { id: 'l2', name: 'Quick wins',  color: '#10b981', count: 64, recent: ['Reply to Eleni', 'Reset router'] },
  { id: 'l3', name: 'Reading',     color: '#f59e0b', count: 19, recent: ['Demon Copperhead ch.10'] },
  { id: 'l4', name: 'Health',      color: '#ef4444', count: 41, recent: ['5km easy run', 'Stretch routine'] },
  { id: 'l5', name: 'Bills & life',color: '#0ea5e9', count: 12, recent: ['Renew passport', 'Pay rent'] },
  { id: 'l6', name: 'Side project',color: '#ec4899', count: 23, recent: ['Sketch app icon', 'Set up linter'] },
  { id: 'l7', name: 'Errands',     color: '#84cc16', count: 17, recent: ['Grocery run', 'Dry cleaner'] },
];

// Activity feed — richer than the dashboard widget
const FEED = [
  { id: 'fd1', user: 'u4', when: '7m',  kind: 'task',  task: 'Run 2 · intervals', room: 'Couch to 5K', reactions: { '🔥': 3, '👏': 2 }, mine: false },
  { id: 'fd2', user: 'u3', when: '32m', kind: 'photo', text: 'Today\'s sourdough loaf — finally got the ear right.',
    photoStyle: { background: 'linear-gradient(135deg, #f4c98a, #d97757 70%, #6b3e1f)' },
    reactions: { '❤️': 8, '🍞': 5, '🤤': 2 }, mine: false },
  { id: 'fd3', user: 'u5', when: '1h',  kind: 'streak', text: 'hit a 30-day streak!', reactions: { '🔥': 12, '🙌': 6 }, mine: false },
  { id: 'fd4', user: 'me', when: '2h',  kind: 'task',  task: 'Sketch the room invite screen', reactions: { '👀': 1 }, mine: true },
  { id: 'fd5', user: 'u2', when: '3h',  kind: 'plan',  text: 'Made plans for Saturday', meta: 'Hike · Bear Mountain', reactions: { '⛰️': 4, '🥾': 2 } },
  { id: 'fd6', user: 'u1', when: '5h',  kind: 'room',  text: 'joined', meta: 'Slow Reads · Demon Copperhead', reactions: { '📖': 2 } },
  { id: 'fd7', user: 'u7', when: '8h',  kind: 'task',  task: 'Shipped the migrations PR', reactions: { '🚀': 6, '🎉': 4, '🙌': 1 } },
  { id: 'fd8', user: 'u4', when: '1d',  kind: 'photo', text: 'Morning view from the top.',
    photoStyle: { background: 'linear-gradient(160deg, #4a7ba7, #82b1d9 50%, #cbe1f3)' },
    reactions: { '🌅': 5, '😍': 3 } },
];

// Report data — extended history for analytics
const REPORT = {
  range: { from: 'Apr 22', to: 'May 21' },
  kpi: {
    completionRate: 78,
    completionDelta: +6,
    tasksDone: 142,
    tasksDelta: +18,
    avgPerDay: 4.7,
    avgDelta: +0.4,
    streak: 8,
    streakBest: 21,
  },
  // 28 days, 0 (no activity) to 4 (very active)
  heatmap: [
    0, 2, 3, 4, 2, 1, 0,
    1, 3, 4, 4, 3, 2, 1,
    0, 2, 3, 3, 4, 2, 0,
    1, 3, 4, 3, 4, 3, 2,
  ],
  byCategory: [
    { key: 'Design',   count: 38, color: '#a855f7' },
    { key: 'Health',   count: 32, color: '#10b981' },
    { key: 'Work',     count: 27, color: '#0ea5e9' },
    { key: 'Reading',  count: 18, color: '#f59e0b' },
    { key: 'Personal', count: 15, color: '#ec4899' },
    { key: 'Errands',  count: 12, color: '#84cc16' },
  ],
  // 24 hours, completion counts
  byHour: [0,0,0,0,0,1,3,8,12,15,11,7,9,11,8,6,9,12,14,10,6,3,1,0],
  byWeekday: [
    { key: 'Mon', count: 26 }, { key: 'Tue', count: 31 }, { key: 'Wed', count: 24 },
    { key: 'Thu', count: 29 }, { key: 'Fri', count: 18 }, { key: 'Sat', count: 9 }, { key: 'Sun', count: 5 },
  ],
};

// Public/shared activity by friends (for dashboard)
const FRIEND_FEED = [
  { id: 'f1', user: 'u4', kind: 'task',  text: 'Finished "Run 2 · intervals"', meta: 'Couch to 5K', when: '12m' },
  { id: 'f2', user: 'u3', kind: 'photo', text: 'Posted a daily memory',         meta: 'Sourdough day',  when: '1h' },
  { id: 'f3', user: 'u5', kind: 'task',  text: 'Finished "Chapter 10"',         meta: 'Demon Copperhead', when: '5h' },
  { id: 'f4', user: 'u2', kind: 'plan',  text: 'Made plans for Saturday',       meta: 'Hike · Bear Mountain', when: '1d' },
];

// Helpers
function getUser(id) {
  if (id === 'me') return ME;
  return FRIENDS.find((f) => f.id === id);
}
function pct(roomTask, members) {
  const total = members.length;
  const done = members.reduce((n, m) => n + (roomTask.done[m] ? 1 : 0), 0);
  return Math.round((done / total) * 100);
}
function roomPct(room) {
  const totals = room.tasks.map((t) => pct(t, room.members));
  return Math.round(totals.reduce((a, b) => a + b, 0) / totals.length);
}
function myRoomPct(room) {
  const mine = room.tasks.filter((t) => t.done.me).length;
  return Math.round((mine / room.tasks.length) * 100);
}

Object.assign(window, {
  hueFor, STATUSES, ME, FRIENDS, FRIEND_REQUESTS, makeTasks, CATEGORIES, ROOMS,
  NOTIFS, FRIEND_FEED, PROGRESS_HISTORY, STREAK, STATS, PARTNERS, PARTNER_REQUESTS,
  LABELS, FEED, REPORT,
  getUser, pct, roomPct, myRoomPct,
});
