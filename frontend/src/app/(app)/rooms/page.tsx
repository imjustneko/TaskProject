export default function RoomsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-base dark:text-text-base-dark">Rooms</h1>
        <button className="h-10 px-4 rounded-input bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors">
          + Create Room
        </button>
      </div>

      <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-12 shadow-sm text-center">
        <p className="text-4xl mb-3">🏠</p>
        <h3 className="font-semibold text-text-base dark:text-text-base-dark mb-1">No rooms yet</h3>
        <p className="text-sm text-text-muted dark:text-text-muted-dark">Create a room and invite friends to do activities together.</p>
      </div>
    </div>
  );
}
