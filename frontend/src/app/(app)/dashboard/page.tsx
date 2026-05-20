export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-base dark:text-text-base-dark">
          Good morning! 👋
        </h1>
        <p className="text-text-muted dark:text-text-muted-dark text-sm mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-text-base dark:text-text-base-dark">Today&apos;s Tasks</h2>
              <span className="text-sm text-text-muted dark:text-text-muted-dark">0 / 0</span>
            </div>
            <div className="h-2 bg-surface-2 dark:bg-surface-dark-2 rounded-full mb-4" />
            <p className="text-center text-text-muted dark:text-text-muted-dark py-8 text-sm">
              No tasks yet. Add your first task!
            </p>
            <button className="w-full h-10 rounded-input border border-dashed border-border dark:border-border-dark text-text-muted dark:text-text-muted-dark text-sm hover:border-primary-400 hover:text-primary-500 transition-colors">
              + New Task
            </button>
          </div>

          <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-5 shadow-sm">
            <h2 className="font-semibold text-text-base dark:text-text-base-dark mb-4">Upcoming Plans</h2>
            <p className="text-center text-text-muted dark:text-text-muted-dark py-8 text-sm">
              No upcoming plans. Plan ahead!
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-5 shadow-sm">
            <h2 className="font-semibold text-text-base dark:text-text-base-dark mb-3">Friends Online</h2>
            <p className="text-center text-text-muted dark:text-text-muted-dark py-6 text-sm">
              Add friends to see their status
            </p>
          </div>

          <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-5 shadow-sm">
            <h2 className="font-semibold text-text-base dark:text-text-base-dark mb-3">Active Rooms</h2>
            <p className="text-center text-text-muted dark:text-text-muted-dark py-6 text-sm">
              No active rooms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
