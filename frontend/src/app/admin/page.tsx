const stats = [
  { label: "Total Users",     value: "0" },
  { label: "Active Users",    value: "0" },
  { label: "Total Tasks",     value: "0" },
  { label: "Completed Tasks", value: "0" },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-base dark:text-text-base-dark mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-5 shadow-sm"
          >
            <p className="text-sm text-text-muted dark:text-text-muted-dark mb-1">{label}</p>
            <p className="text-3xl font-bold text-primary-500">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-5 shadow-sm">
        <h2 className="font-semibold text-text-base dark:text-text-base-dark mb-4">Recent Signups</h2>
        <p className="text-center text-sm text-text-muted dark:text-text-muted-dark py-8">No users yet.</p>
      </div>
    </div>
  );
}
