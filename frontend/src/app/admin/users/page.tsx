export default function AdminUsersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-base dark:text-text-base-dark">User Management</h1>
        <input
          type="search"
          placeholder="Search users..."
          className="h-10 w-64 rounded-input border border-border dark:border-border-dark bg-surface-2 dark:bg-surface-dark-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 dark:bg-surface-dark-2">
            <tr>
              {["User", "Email", "Joined", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-muted dark:text-text-muted-dark uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="text-center py-12 text-text-muted dark:text-text-muted-dark">
                No users found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
