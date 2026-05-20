export default async function RoomPage({ params }: PageProps<"/rooms/[id]">) {
  const { id } = await params;
  return (
    <div className="h-full flex gap-6">
      <div className="flex-1 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card shadow-sm p-5">
        <h1 className="font-bold text-text-base dark:text-text-base-dark mb-4">Room Tasks</h1>
        <p className="text-sm text-text-muted dark:text-text-muted-dark">Room {id} — tasks coming soon.</p>
      </div>
      <div className="w-80 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card shadow-sm p-5 flex flex-col">
        <h2 className="font-bold text-text-base dark:text-text-base-dark mb-4">Chat</h2>
        <div className="flex-1" />
        <input
          type="text"
          placeholder="Type a message..."
          className="h-10 w-full rounded-input border border-border dark:border-border-dark bg-surface-2 dark:bg-surface-dark-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
    </div>
  );
}
