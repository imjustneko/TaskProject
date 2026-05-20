export default async function DMPage({ params }: PageProps<"/chat/[userId]">) {
  const { userId } = await params;
  return (
    <div className="h-full flex flex-col bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card shadow-sm">
      <div className="p-4 border-b border-border dark:border-border-dark">
        <h2 className="font-semibold text-text-base dark:text-text-base-dark">DM — {userId}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4" />
      <div className="p-4 border-t border-border dark:border-border-dark">
        <input
          type="text"
          placeholder="Type a message..."
          className="h-10 w-full rounded-input border border-border dark:border-border-dark bg-surface-2 dark:bg-surface-dark-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
    </div>
  );
}
