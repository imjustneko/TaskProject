"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { Avatar } from "@/components/ui/avatar";
import { STATUS_META } from "@/types";
import type { StatusType } from "@/types";
import api from "@/lib/api";
import { useState } from "react";

const schema = z.object({
  displayName: z.string().min(1).max(50),
  bio: z.string().max(160).optional(),
});
type FormData = z.infer<typeof schema>;

const STATUSES: StatusType[] = ["PLAYING", "COOKING", "WALKING", "STUDYING", "READING", "WORKING"];

export default function ProfileEditPage() {
  const { user, updateUser } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [activeStatus, setActiveStatus] = useState<StatusType | null>(
    (user?.status?.type as StatusType) ?? null
  );
  const [customText, setCustomText] = useState(user?.status?.customText ?? "");

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: user?.displayName ?? "",
      bio: user?.bio ?? "",
    },
  });

  const updateProfile = useMutation({
    mutationFn: (data: FormData) =>
      api.patch("/users/me", data).then((r) => r.data),
    onSuccess: (updated) => {
      updateUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const setStatus = useMutation({
    mutationFn: (type: StatusType) =>
      api.put("/status", { type, customText: customText || undefined }).then((r) => r.data),
    onSuccess: (status) => {
      updateUser({ status });
      setActiveStatus(status.type);
    },
  });

  const clearStatus = useMutation({
    mutationFn: () => api.delete("/status"),
    onSuccess: () => {
      updateUser({ status: undefined });
      setActiveStatus(null);
      setCustomText("");
    },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-text-base dark:text-text-base-dark">Профайл засах</h1>

      {/* Profile form */}
      <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card shadow-sm p-6">
        <h2 className="font-semibold text-text-base dark:text-text-base-dark mb-5">Ерөнхий мэдээлэл</h2>

        <div className="flex items-center gap-4 mb-6">
          <Avatar name={user?.displayName ?? "User"} src={user?.avatarUrl} size="xl" />
          <div>
            <button className="h-9 px-4 rounded-input border border-border dark:border-border-dark text-sm font-medium text-text-base dark:text-text-base-dark hover:bg-surface-2 dark:hover:bg-surface-dark-2 transition-colors">
              Зураг солих
            </button>
            <p className="text-xs text-text-muted dark:text-text-muted-dark mt-1">JPG, PNG — max 5MB</p>
          </div>
        </div>

        <form onSubmit={handleSubmit((d) => updateProfile.mutate(d))} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-base dark:text-text-base-dark">Дэлгэрэнгүй нэр</label>
              <input
                {...register("displayName")}
                className="h-11 rounded-input border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-3 text-sm text-text-base dark:text-text-base-dark focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.displayName && <p className="text-xs text-error-500">{errors.displayName.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-base dark:text-text-base-dark">Хэрэглэгчийн нэр</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle dark:text-text-subtle-dark text-sm">@</span>
                <input
                  value={user?.username ?? ""}
                  disabled
                  className="h-11 w-full rounded-input border border-border dark:border-border-dark bg-surface-2 dark:bg-surface-dark-2 pl-7 pr-3 text-sm text-text-muted dark:text-text-muted-dark cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-base dark:text-text-base-dark">Биографи</label>
            <textarea
              {...register("bio")}
              rows={3}
              maxLength={160}
              placeholder="Өөрийгөө товч танилцуулна уу..."
              className="w-full rounded-input border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-3 py-2.5 text-sm text-text-base dark:text-text-base-dark resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            {saved && <span className="text-sm text-success-500 flex items-center">✓ Хадгалагдлаа</span>}
            <button
              type="submit"
              disabled={updateProfile.isPending || !isDirty}
              className="h-10 px-4 rounded-input bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-60"
            >
              {updateProfile.isPending ? "Хадгалж байна..." : "Хадгалах"}
            </button>
          </div>
        </form>
      </div>

      {/* Status */}
      <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-text-base dark:text-text-base-dark">Одоогийн статус</h2>
          {activeStatus && (
            <button
              onClick={() => clearStatus.mutate()}
              className="text-xs text-error-500 hover:underline"
            >
              Устгах
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {STATUSES.map((s) => {
            const m = STATUS_META[s];
            return (
              <button
                key={s}
                onClick={() => setStatus.mutate(s)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-card border-2 transition-all text-sm font-medium ${
                  activeStatus === s
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-700/20 text-primary-600 dark:text-primary-300"
                    : "border-border dark:border-border-dark hover:border-primary-200 dark:hover:border-primary-700 text-text-muted dark:text-text-muted-dark"
                }`}
              >
                <span className="text-xl">{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <input
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="✏️ Өөрийн статус..."
            className="flex-1 h-10 rounded-input border border-border dark:border-border-dark bg-surface-2 dark:bg-surface-dark-2 px-3 text-sm text-text-base dark:text-text-base-dark focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={() => setStatus.mutate("CUSTOM")}
            disabled={!customText.trim()}
            className="h-10 px-4 rounded-input bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-60"
          >
            Тохируулах
          </button>
        </div>
      </div>
    </div>
  );
}
