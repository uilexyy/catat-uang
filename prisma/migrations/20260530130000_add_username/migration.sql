ALTER TABLE "users" DROP COLUMN "email";
ALTER TABLE "users" DROP COLUMN "name";
ALTER TABLE "users" ADD COLUMN "username" VARCHAR(100) NOT NULL;
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
