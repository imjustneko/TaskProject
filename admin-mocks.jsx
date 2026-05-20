// admin-mocks.jsx — Admin panel mock data

const ADMIN_STATS = {
  totalUsers:        { value: 12_847, delta: '+218',  hint: 'last 7 days' },
  activeNow:         { value:    642, delta: '+12%',  hint: 'vs. 7-day avg' },
  totalTasks:        { value: 481_220, delta: '+9.4k',hint: 'last 7 days' },
  completedTasks:    { value: 372_119, delta: '77%',  hint: 'completion rate' },
  rooms:             { value:  3_204, delta: '+62',   hint: 'last 7 days' },
  openReports:       { value:     14, delta: '+3',    hint: 'last 24h', tone: 'warn' },
};

// 7-day signups sparkline data
const ADMIN_SIGNUPS_7D = [142, 168, 132, 201, 245, 268, 218];

// 14-day DAU sparkline
const ADMIN_DAU_14D = [524, 558, 612, 598, 631, 670, 642, 655, 688, 702, 690, 715, 728, 711];

const ADMIN_USERS_EXTRA = [
  { id: 'au1', name: 'Eleni Roussos',  handle: '@eleni',  email: 'eleni@type.gr',     joined: 'May 19', tasksDone: 12, status: 'active',  presence: 'online',  reports: 0 },
  { id: 'au2', name: 'Bear Williams',  handle: '@bear',   email: 'bear@trail.io',     joined: 'May 18', tasksDone: 3,  status: 'active',  presence: 'idle',    reports: 0 },
  { id: 'au3', name: 'Reggie Chen',    handle: '@reggie', email: 'reggie@hey.com',    joined: 'May 17', tasksDone: 47, status: 'active',  presence: 'online',  reports: 0 },
  { id: 'au4', name: 'Naya Idris',     handle: '@naya',   email: 'naya@gmail.com',    joined: 'May 16', tasksDone: 22, status: 'active',  presence: 'offline', reports: 0 },
  { id: 'au5', name: 'Jonas Weber',    handle: '@jonas',  email: 'jonas@web.de',      joined: 'May 14', tasksDone: 89, status: 'active',  presence: 'online',  reports: 1 },
  { id: 'au6', name: 'Quincy Patel',   handle: '@quincy', email: 'quincy@yopmail.io', joined: 'May 12', tasksDone: 4,  status: 'flagged', presence: 'offline', reports: 3 },
  { id: 'au7', name: 'Marisol Vega',   handle: '@marisol',email: 'marisol@vega.app',  joined: 'May 11', tasksDone: 134,status: 'active',  presence: 'online',  reports: 0 },
  { id: 'au8', name: 'Drew Calloway',  handle: '@drew',   email: 'drew@discord.fan',  joined: 'May 09', tasksDone: 0,  status: 'blocked', presence: 'offline', reports: 5 },
  { id: 'au9', name: 'Astrid Holm',    handle: '@astrid', email: 'astrid@holm.no',    joined: 'May 08', tasksDone: 67, status: 'active',  presence: 'idle',    reports: 0 },
  { id: 'au10', name: 'Tomás Ferreira',handle: '@tomas',  email: 'tomas@ferreira.pt', joined: 'May 06', tasksDone: 31, status: 'active',  presence: 'online',  reports: 0 },
];

// Reports queue (content moderation)
const ADMIN_REPORTS = [
  {
    id: 'rp1', kind: 'message', when: '12m', reason: 'Harassment',
    reporter: { name: 'Liora Bennett', handle: '@liora' },
    target:   { name: 'Drew Calloway', handle: '@drew' },
    preview:  'you should just delete your account, no one likes the photos',
    context:  'Room · "Couch to 5K"',
  },
  {
    id: 'rp2', kind: 'photo', when: '38m', reason: 'Inappropriate image',
    reporter: { name: 'Felix Moreau', handle: '@felix' },
    target:   { name: 'Quincy Patel', handle: '@quincy' },
    preview:  null, // photo placeholder
    context:  'Daily memory · task "Morning routine"',
  },
  {
    id: 'rp3', kind: 'profile', when: '2h', reason: 'Spam / fake account',
    reporter: { name: 'Asher Khan',  handle: '@asher' },
    target:   { name: 'Quincy Patel', handle: '@quincy' },
    preview:  'Bio: "FOLLOW ME FOR FREE CRYPTO 💸💸💸 dm now"',
    context:  'Profile bio',
  },
  {
    id: 'rp4', kind: 'message', when: '4h', reason: 'Hate speech',
    reporter: { name: 'Theo Park', handle: '@theo' },
    target:   { name: 'Drew Calloway', handle: '@drew' },
    preview:  '[redacted slur]',
    context:  'DM',
  },
  {
    id: 'rp5', kind: 'task', when: '6h', reason: 'Disturbing content',
    reporter: { name: 'Mira Tanaka', handle: '@mira' },
    target:   { name: 'Quincy Patel', handle: '@quincy' },
    preview:  'Task title: "kill the project"',
    context:  'Shared task',
  },
];

Object.assign(window, {
  ADMIN_STATS, ADMIN_SIGNUPS_7D, ADMIN_DAU_14D, ADMIN_USERS_EXTRA, ADMIN_REPORTS,
});
