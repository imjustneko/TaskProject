export default function ChatPage() {
  return (
    <div className="h-full flex gap-4">
      <div className="w-72 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card shadow-sm overflow-y-auto">
        <div className="p-4 border-b border-border dark:border-border-dark">
          <h2 className="font-semibold text-text-base dark:text-text-base-dark">Messages</h2>
        </div>
        <div className="p-4 text-center text-sm text-text-muted dark:text-text-muted-dark py-12">
          No conversations yet
        </div>
      </div>

      <div className="flex-1 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card shadow-sm flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">💬</p>
          <h3 className="font-semibold text-text-base dark:text-text-base-dark mb-1">Select a conversation</h3>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">Choose a friend to start chatting.</p>
        </div>
      </div>
    </div>
  );
}
