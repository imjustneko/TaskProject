"use client";

import { useState } from "react";
import { useAdminUsers, useBlockUser, useUnblockUser, useDeleteAdminUser, useSetUserRole } from "@/hooks/useAdmin";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);
  const { data, isLoading } = useAdminUsers(debouncedSearch || undefined, page);
  const block = useBlockUser();
  const unblock = useUnblockUser();
  const del = useDeleteAdminUser();
  const setRole = useSetUserRole();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / (data?.limit ?? 20));

  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:26 }}>User Management</h1>
          <div className="muted" style={{ marginTop:4,fontSize:13 }}>{total} users total</div>
        </div>
        <div className="input-search" style={{ width:280 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5"/></svg>
          <input className="input" placeholder="Search users…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>

      <div className="card" style={{ padding:0,overflow:"hidden" }}>
        <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
          <thead>
            <tr style={{ background:"var(--bg-subtle)" }}>
              {["User","Email","Joined","Tasks","Status","Actions"].map(h=>(
                <th key={h} style={{ textAlign:"left",padding:"10px 16px",fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:"var(--text-muted)",borderBottom:"1px solid var(--border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} style={{ textAlign:"center",padding:"40px 20px",color:"var(--text-muted)" }}>Loading…</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign:"center",padding:"40px 20px",color:"var(--text-muted)" }}>No users found.</td></tr>
            ) : (
              users.map(u => (
                <tr key={u.id} style={{ borderBottom:"1px solid var(--border)" }}>
                  <td style={{ padding:"12px 16px" }}>
                    <div className="row gap-3">
                      <Avatar user={{ displayName:u.displayName,avatarUrl:u.avatarUrl }} size={32} />
                      <div>
                        <div style={{ fontWeight:500 }}>{u.displayName}</div>
                        <div className="muted" style={{ fontSize:11 }}>@{u.username}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:"12px 16px",color:"var(--text-soft)" }}>{u.email}</td>
                  <td style={{ padding:"12px 16px" }}>
                    <span className="mono muted" style={{ fontSize:12 }}>{formatDate(u.createdAt,{month:"short",day:"numeric",year:"numeric"})}</span>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <span className="mono" style={{ fontSize:12 }}>{u._count?.tasks ?? 0}</span>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <div className="row gap-2">
                      {u.isBlocked
                        ? <Badge tone="danger">Blocked</Badge>
                        : <Badge tone="success" dot>Active</Badge>}
                      {u.role==="ADMIN" && <Badge tone="accent">Admin</Badge>}
                    </div>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <div className="row gap-1">
                      {u.isBlocked ? (
                        <button className="btn btn-sm btn-ghost" onClick={() => unblock.mutate(u.id)} disabled={unblock.isPending} style={{ color:"var(--status-online)" }}>
                          Unblock
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-ghost" onClick={() => block.mutate(u.id)} disabled={block.isPending} style={{ color:"var(--status-idle)" }}>
                          Block
                        </button>
                      )}
                      {u.role === "ADMIN" ? (
                        <button className="btn btn-sm btn-ghost" onClick={() => setRole.mutate({ userId: u.id, role: "USER" })} disabled={setRole.isPending} style={{ color:"var(--text-muted)" }}>
                          Remove Admin
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-ghost" onClick={() => setRole.mutate({ userId: u.id, role: "ADMIN" })} disabled={setRole.isPending} style={{ color:"var(--accent)" }}>
                          Make Admin
                        </button>
                      )}
                      {confirmDelete === u.id ? (
                        <div className="row gap-1">
                          <button className="btn btn-sm" style={{ background:"var(--status-busy)",color:"#fff",borderColor:"var(--status-busy)" }} onClick={() => { del.mutate(u.id); setConfirmDelete(null); }}>Confirm</button>
                          <button className="btn btn-sm btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
                        </div>
                      ) : (
                        <button className="btn btn-sm btn-ghost" onClick={() => setConfirmDelete(u.id)} style={{ color:"var(--status-busy)" }}>Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="row" style={{ justifyContent:"center",gap:8,marginTop:20 }}>
          <button className="btn btn-sm" disabled={page===1} onClick={() => setPage(p=>p-1)}>← Prev</button>
          <span className="muted" style={{ fontSize:13,padding:"0 8px" }}>Page {page} of {totalPages}</span>
          <button className="btn btn-sm" disabled={page===totalPages} onClick={() => setPage(p=>p+1)}>Next →</button>
        </div>
      )}
    </div>
  );
}
