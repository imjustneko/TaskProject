export default async function UserProfilePage({ params }: PageProps<"/users/[username]">) {
  const { username } = await params;
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-400 to-accent-500" />
        <div className="p-6">
          <div className="flex items-end gap-4 -mt-12 mb-4">
            <div className="h-20 w-20 rounded-full bg-primary-100 dark:bg-primary-700 border-4 border-surface dark:border-surface-dark flex items-center justify-center text-2xl font-bold text-primary-600 dark:text-primary-200">
              {username[0].toUpperCase()}
            </div>
          </div>
          <h1 className="text-xl font-bold text-text-base dark:text-text-base-dark">@{username}</h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark mt-1">User profile — coming soon.</p>
        </div>
      </div>
    </div>
  );
}
