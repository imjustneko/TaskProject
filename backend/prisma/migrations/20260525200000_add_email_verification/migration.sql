-- Add email verification flag (default true for existing users to avoid locking them out)
ALTER TABLE "users" ADD COLUMN "isEmailVerified" BOOLEAN NOT NULL DEFAULT true;

-- New users will default to false — update the default after backfilling
ALTER TABLE "users" ALTER COLUMN "isEmailVerified" SET DEFAULT false;

-- Create email_verifications table
CREATE TABLE "email_verifications" (
  "id"        TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "token"     TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "email_verifications_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "email_verifications_userId_key" ON "email_verifications"("userId");
CREATE UNIQUE INDEX "email_verifications_token_key" ON "email_verifications"("token");

ALTER TABLE "email_verifications"
  ADD CONSTRAINT "email_verifications_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
