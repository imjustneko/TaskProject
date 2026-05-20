export default function FriendsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-base dark:text-text-base-dark">Friends</h1>
        <button className="h-10 px-4 rounded-input bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors">
          + Find Friends
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-2 dark:bg-surface-dark-2 rounded-card w-fit mb-6">
        {["My Friends", "Requests", "Suggestions"].map((tab) => (
          <button
            key={tab}
            className="px-4 py-2 text-sm font-medium rounded-input text-text-muted dark:text-text-muted-dark hover:text-text-base dark:hover:text-text-base-dark transition-colors first:bg-surface first:dark:bg-surface-dark first:shadow-sm first:text-text-base first:dark:text-text-base-dark"
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-12 shadow-sm text-center">
        <p className="text-4xl mb-3">👥</p>
        <h3 className="font-semibold text-text-base dark:text-text-base-dark mb-1">No friends yet</h3>
        <p className="text-sm text-text-muted dark:text-text-muted-dark">Search for users to add as friends.</p>
      </div>
    </div>
  );
}
