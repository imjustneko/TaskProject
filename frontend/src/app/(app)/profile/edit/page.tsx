export default function ProfileEditPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-text-base dark:text-text-base-dark mb-6">Edit Profile</h1>

      <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card shadow-sm p-6 space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-primary-100 dark:bg-primary-700 flex items-center justify-center text-2xl font-bold text-primary-600 dark:text-primary-200">
            U
          </div>
          <button className="h-9 px-4 rounded-input border border-border dark:border-border-dark text-sm font-medium text-text-base dark:text-text-base-dark hover:bg-surface-2 dark:hover:bg-surface-dark-2 transition-colors">
            Change Photo
          </button>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-base dark:text-text-base-dark">Display Name</label>
            <input className="h-11 rounded-input border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-base dark:text-text-base-dark">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle dark:text-text-subtle-dark text-sm">@</span>
              <input className="h-11 w-full rounded-input border border-border dark:border-border-dark bg-surface dark:bg-surface-dark pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-base dark:text-text-base-dark">Bio</label>
          <textarea
            rows={3}
            maxLength={160}
            placeholder="Tell your friends about yourself..."
            className="w-full rounded-input border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button className="h-10 px-4 rounded-input border border-border dark:border-border-dark text-sm font-medium text-text-base dark:text-text-base-dark hover:bg-surface-2 dark:hover:bg-surface-dark-2 transition-colors">
            Cancel
          </button>
          <button className="h-10 px-4 rounded-input bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
