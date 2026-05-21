export type Role = "USER" | "ADMIN";

export type StatusType =
  | "PLAYING"
  | "COOKING"
  | "WALKING"
  | "STUDYING"
  | "READING"
  | "WORKING"
  | "CUSTOM"
  | "OFFLINE";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type FriendStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED";

export type RoomRole = "OWNER" | "ADMIN" | "MEMBER";

export type MessageType = "TEXT" | "IMAGE" | "SYSTEM";

export type NotificationType =
  | "FRIEND_REQUEST"
  | "FRIEND_ACCEPTED"
  | "ROOM_INVITE"
  | "TASK_REMINDER"
  | "MENTION";

export interface UserStatus {
  id: string;
  type: StatusType;
  customText?: string;
  emoji?: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  role: Role;
  isBlocked: boolean;
  createdAt: string;
  status?: UserStatus;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  date?: string;
  time?: string;
  category?: string;
  priority: Priority;
  isCompleted: boolean;
  isPublic: boolean;
  imageUrl?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Friend {
  id: string;
  requesterId: string;
  recipientId: string;
  status: FriendStatus;
  requester: User;
  recipient: User;
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  activityType?: StatusType;
  createdById: string;
  isPublic: boolean;
  createdAt: string;
  members: RoomMember[];
  tasks: RoomTask[];
  emojis?: RoomEmoji[];
}

export interface RoomMember {
  id: string;
  roomId: string;
  userId: string;
  role: RoomRole;
  joinedAt: string;
  user: User;
}

export interface RoomTask {
  id: string;
  roomId: string;
  task: Task;
  completedBy: string[];
  failedBy: string[];
  skippedBy: string[];
}

export interface RoomEmoji {
  id: string;
  roomId: string;
  name: string;
  imageUrl: string;
  addedById: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  content?: string;
  imageUrl?: string;
  type: MessageType;
  roomId?: string;
  recipientId?: string;
  createdAt: string;
  sender: User;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  fromId?: string;
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
  from?: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const STATUS_META: Record<
  StatusType,
  { label: string; emoji: string; color: string }
> = {
  PLAYING:  { label: "Playing",  emoji: "🎮", color: "text-status-playing" },
  COOKING:  { label: "Cooking",  emoji: "🍳", color: "text-status-cooking" },
  WALKING:  { label: "Walking",  emoji: "🚶", color: "text-status-walking" },
  STUDYING: { label: "Studying", emoji: "📖", color: "text-status-studying" },
  READING:  { label: "Reading",  emoji: "📚", color: "text-status-reading" },
  WORKING:  { label: "Working",  emoji: "💼", color: "text-status-working" },
  CUSTOM:   { label: "Custom",   emoji: "✏️", color: "text-status-custom" },
  OFFLINE:  { label: "Offline",  emoji: "⚫", color: "text-status-offline" },
};

export const PRIORITY_META: Record<
  Priority,
  { label: string; color: string; bg: string }
> = {
  LOW:    { label: "Low",    color: "text-success-500",  bg: "bg-success-500/10" },
  MEDIUM: { label: "Medium", color: "text-warning-500",  bg: "bg-warning-500/10" },
  HIGH:   { label: "High",   color: "text-error-500",    bg: "bg-error-500/10" },
  URGENT: { label: "Urgent", color: "text-error-500",    bg: "bg-error-500/20" },
};
