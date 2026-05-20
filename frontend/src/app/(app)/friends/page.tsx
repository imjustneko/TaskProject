"use client";

import { useState } from "react";
import {
  useFriends, useIncomingRequests, useSearchUsers,
  useSendFriendRequest, useAcceptRequest, useDeclineRequest,
} from "@/hooks/useFriends";
import { Avatar } from "@/components/ui/avatar";
import { STATUS_META } from "@/types";
import { Search, UserPlus, Check, X, MessageCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

type Tab = "friends" | "requests" | "search";

export default function FriendsPage() {
  const [tab, setTab] = useState<Tab>("friends");
  const [query, setQuery] = useState("");
  const debouncedQ = useDebounce(query, 400);

  const { data: friends = [], isLoading: friendsLoading } = useFriends();
  const { data: requests = [] } = useIncomingRequests();
  const { data: searchResults = [], isLoading: searching } = useSearchUsers(debouncedQ);

  const sendReq = useSendFriendRequest();
  const acceptReq = useAcceptRequest();
  const declineReq = useDeclineRequest();

  const tabs = [
    { key: "friends" as Tab, label: `Найзууд ${friends.length > 0 ? `(${friends.length})` : ""}` },
    { key: "requests" as Tab, label: `Хүсэлт ${requests.length > 0 ? `(${requests.length})` : ""}` },
    { key: "search" as Tab, label: "Хайх" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-base dark:text-text-base-dark">Найзууд</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-2 dark:bg-surface-dark-2 rounded-card w-fit mb-6">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "px-4 py-2 text-sm rounded-input transition-colors font-medium",
              tab === key
                ? "bg-surface dark:bg-surface-dark shadow-sm text-text-base dark:text-text-base-dark"
                : "text-text-muted dark:text-text-muted-dark hover:text-text-base dark:hover:text-text-base-dark"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Friends tab */}
      {tab === "friends" && (
        <div>
          {friendsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-surface-2 dark:bg-surface-dark-2 rounded-card animate-pulse" />)}
            </div>
          ) : friends.length === 0 ? (
            <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-12 shadow-sm text-center">
              <p className="text-4xl mb-3">👥</p>
              <h3 className="font-semibold text-text-base dark:text-text-base-dark mb-1">Найз байхгүй байна</h3>
              <p className="text-sm text-text-muted dark:text-text-muted-dark mb-4">Хайлт хийж найз нэмнэ үү.</p>
              <button
                onClick={() => setTab("search")}
                className="h-9 px-4 rounded-input bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
              >
                Хайх
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-4 shadow-sm flex items-center gap-3"
                >
                  <Avatar name={friend.displayName} src={friend.avatarUrl} size="md" status={friend.status?.type} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-base dark:text-text-base-dark truncate">{friend.displayName}</p>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">@{friend.username}</p>
                    {friend.status && (
                      <p className="text-xs text-text-muted dark:text-text-muted-dark mt-0.5">
                        {STATUS_META[friend.status.type].emoji}{" "}
                        {friend.status.customText ?? STATUS_META[friend.status.type].label}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/chat/${friend.id}`}
                    className="h-9 w-9 rounded-input flex items-center justify-center text-text-muted dark:text-text-muted-dark hover:bg-surface-2 dark:hover:bg-surface-dark-2 transition-colors shrink-0"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Requests tab */}
      {tab === "requests" && (
        <div>
          {requests.length === 0 ? (
            <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-12 shadow-sm text-center">
              <p className="text-4xl mb-3">📬</p>
              <h3 className="font-semibold text-text-base dark:text-text-base-dark mb-1">Хүсэлт байхгүй</h3>
              <p className="text-sm text-text-muted dark:text-text-muted-dark">Шинэ найзын хүсэлт ирэхэд энд харагдана.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div key={req.id} className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-4 shadow-sm flex items-center gap-3">
                  <Avatar name={req.requester.displayName} src={req.requester.avatarUrl} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-base dark:text-text-base-dark">{req.requester.displayName}</p>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">@{req.requester.username}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => acceptReq.mutate(req.id)}
                      className="h-9 w-9 rounded-input bg-success-500/10 text-success-500 hover:bg-success-500 hover:text-white flex items-center justify-center transition-colors"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => declineReq.mutate(req.id)}
                      className="h-9 w-9 rounded-input bg-error-500/10 text-error-500 hover:bg-error-500 hover:text-white flex items-center justify-center transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search tab */}
      {tab === "search" && (
        <div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-subtle dark:text-text-subtle-dark" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Нэр эсвэл хэрэглэгчийн нэрээр хайх..."
              autoFocus
              className="h-11 w-full rounded-input border border-border dark:border-border-dark bg-surface dark:bg-surface-dark pl-10 pr-4 text-sm text-text-base dark:text-text-base-dark placeholder:text-text-subtle dark:placeholder:text-text-subtle-dark focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {searching ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <div key={i} className="h-16 bg-surface-2 dark:bg-surface-dark-2 rounded-card animate-pulse" />)}
            </div>
          ) : debouncedQ.length >= 2 && searchResults.length === 0 ? (
            <div className="text-center py-12 text-text-muted dark:text-text-muted-dark text-sm">
              &quot;{debouncedQ}&quot; хэрэглэгч олдсонгүй
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map((user) => (
                <div key={user.id} className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-4 shadow-sm flex items-center gap-3">
                  <Avatar name={user.displayName} src={user.avatarUrl} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-base dark:text-text-base-dark">{user.displayName}</p>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">@{user.username}</p>
                  </div>
                  <button
                    onClick={() => sendReq.mutate(user.id)}
                    disabled={sendReq.isPending}
                    className="h-9 px-3 rounded-input bg-primary-500/10 text-primary-500 hover:bg-primary-500 hover:text-white text-sm font-medium flex items-center gap-1.5 transition-colors disabled:opacity-60"
                  >
                    <UserPlus className="h-4 w-4" />
                    Нэмэх
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
