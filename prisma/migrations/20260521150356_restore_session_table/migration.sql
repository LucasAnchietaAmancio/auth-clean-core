-- Rename the session foreign-key column without dropping existing data.
ALTER TABLE "sessions" DROP CONSTRAINT IF EXISTS "sessions_user_id_fkey";

ALTER TABLE "sessions" RENAME COLUMN "user_id" TO "id_user";

ALTER TABLE "sessions"
ADD CONSTRAINT "sessions_id_user_fkey"
FOREIGN KEY ("id_user") REFERENCES "users"("id_user")
ON DELETE RESTRICT ON UPDATE CASCADE;
