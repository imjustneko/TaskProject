-- Add missing enums
CREATE TYPE "PresenceType" AS ENUM ('ONLINE', 'IDLE', 'DND', 'INVISIBLE');
CREATE TYPE "LogStatus" AS ENUM ('DONE', 'FAILED', 'SKIPPED');
CREATE TYPE "PartnerStatus" AS ENUM ('PENDING', 'ACTIVE', 'DECLINED');

-- Add presence column to user_statuses
ALTER TABLE "user_statuses" ADD COLUMN "presence" "PresenceType" NOT NULL DEFAULT 'ONLINE';

-- Add imageUrl to rooms
ALTER TABLE "rooms" ADD COLUMN "imageUrl" TEXT;

-- Add failedBy, skippedBy to room_tasks
ALTER TABLE "room_tasks" ADD COLUMN "failedBy" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "room_tasks" ADD COLUMN "skippedBy" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add taskId to posts
ALTER TABLE "posts" ADD COLUMN "taskId" TEXT;
ALTER TABLE "posts" ADD CONSTRAINT "posts_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable task_logs
CREATE TABLE "task_logs" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "LogStatus" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "task_logs_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "task_logs_taskId_userId_date_key" ON "task_logs"("taskId", "userId", "date");
CREATE INDEX "task_logs_userId_date_idx" ON "task_logs"("userId", "date");
ALTER TABLE "task_logs" ADD CONSTRAINT "task_logs_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "task_logs" ADD CONSTRAINT "task_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable user_emojis
CREATE TABLE "user_emojis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_emojis_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "user_emojis_userId_name_key" ON "user_emojis"("userId", "name");
ALTER TABLE "user_emojis" ADD CONSTRAINT "user_emojis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable labels
CREATE TABLE "labels" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#6366f1',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "labels_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "labels_userId_name_key" ON "labels"("userId", "name");
ALTER TABLE "labels" ADD CONSTRAINT "labels_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable task_labels
CREATE TABLE "task_labels" (
    "taskId" TEXT NOT NULL,
    "labelId" TEXT NOT NULL,
    CONSTRAINT "task_labels_pkey" PRIMARY KEY ("taskId", "labelId")
);
ALTER TABLE "task_labels" ADD CONSTRAINT "task_labels_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "task_labels" ADD CONSTRAINT "task_labels_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "labels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable accountability_pairs
CREATE TABLE "accountability_pairs" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "status" "PartnerStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "accountability_pairs_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "accountability_pairs_requesterId_partnerId_key" ON "accountability_pairs"("requesterId", "partnerId");
CREATE INDEX "accountability_pairs_partnerId_status_idx" ON "accountability_pairs"("partnerId", "status");
ALTER TABLE "accountability_pairs" ADD CONSTRAINT "accountability_pairs_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "accountability_pairs" ADD CONSTRAINT "accountability_pairs_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable room_emojis
CREATE TABLE "room_emojis" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "addedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "room_emojis_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "room_emojis_roomId_name_key" ON "room_emojis"("roomId", "name");
ALTER TABLE "room_emojis" ADD CONSTRAINT "room_emojis_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
