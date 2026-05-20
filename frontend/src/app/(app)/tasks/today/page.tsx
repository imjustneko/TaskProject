export default function TodayTasksPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-base dark:text-text-base-dark">Today</h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark mt-0.5">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <button className="h-10 px-4 rounded-input bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors">
          + New Task
        </button>
      </div>

      {/* Progress */}
      <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-5 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-base dark:text-text-base-dark">Progress</span>
          <span className="text-sm text-text-muted dark:text-text-muted-dark">0 / 0 completed</span>
        </div>
        <div className="h-2 bg-surface-2 dark:bg-surface-dark-2 rounded-full" />
      </div>

      {/* Empty state */}
      <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-12 shadow-sm text-center">
        <p className="text-4xl mb-3">✅</p>
        <h3 className="font-semibold text-text-base dark:text-text-base-dark mb-1">No tasks for today</h3>
        <p className="text-sm text-text-muted dark:text-text-muted-dark">Add tasks to start tracking your day.</p>
      </div>
    </div>
  );
}
