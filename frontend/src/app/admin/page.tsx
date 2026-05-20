"use client";

import { useAdminStats, useAdminRecentUsers } from "@/hooks/useAdmin";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

function StatCard({ label, value, tone = "" }: { label: string; value: number | string; tone?: string }) {
  return (
    <div className="card" style={{ padding:20 }}>
      <div className="muted" style={{ fontSize:12,fontWeight:600,letterSpacing:"0.04em",textTransform:"uppercase",marginBottom:8 }}>{label}</div>
      <div style={{ fontSize:32,fontWeight:700,color:tone||"var(--accent)",lineHeight:1 }}>{value}</div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: recent = [] } = useAdminRecentUsers();

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:26 }}>Admin Dashboard</h1>
        <div className="muted" style={{ marginTop:6,fontSize:14 }}>Platform overview and user management.</div>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom:24, gridTemplateColumns:"repeat(5,1fr)" }}>
        {statsLoading ? (
          [...Array(5)].map((_,i) => <div key={i} style={{ height:90,borderRadius:14,background:"var(--bg-subtle)",animation:"pulse 1.5s ease-in-out infinite" }}/>)
        ) : (
          <>
            <StatCard label="Total Users" value={stats?.totalUsers ?? 0} />
            <StatCard label="Active Users" value={stats?.activeUsers ?? 0} tone="var(--status-online)" />
            <StatCard label="Total Tasks" value={stats?.totalTasks ?? 0} />
            <StatCard label="Completed" value={stats?.completedTasks ?? 0} tone="var(--status-online)" />
            <StatCard label="Rooms" value={stats?.totalRooms ?? 0} />
          </>
        )}
      </div>

      {/* Recent signups */}
      <div className="card">
        <div className="card-hd">
          <h3>Recent signups</h3>
          <span className="muted" style={{ fontSize:12 }}>Last {recent.length} users</span>
          <a href="/admin/users" className="card-hd-action" style={{ textDecoration:"none" }}>
            View all →
          </a>
        </div>
        {recent.length === 0 ? (
          <div style={{ textAlign:"center",padding:"32px 20px",color:"var(--text-muted)",fontSize:13 }}>No users yet.</div>
        ) : (
          <div className="list">
            {recent.map(u => (
              <div key={u.id} className="list-row">
                <Avatar user={{ displayName:u.displayName,avatarUrl:u.avatarUrl }} size={32} />
                <div className="flex1 truncate">
                  <div style={{ fontSize:13.5,fontWeight:500 }}>{u.displayName}</div>
                  <div className="muted truncate" style={{ fontSize:12 }}>{u.email}</div>
                </div>
                <span className="mono muted" style={{ fontSize:12 }}>{formatDate(u.createdAt,{month:"short",day:"numeric"})}</span>
                {u.isBlocked
                  ? <Badge tone="danger">Blocked</Badge>
                  : <Badge tone="success" dot>Active</Badge>}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
}
