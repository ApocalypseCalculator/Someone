/*
  Warnings:

  - You are about to drop the `MemberByChannel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MemberByChannel";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "MemberByGuildCache" (
    "guildid" TEXT NOT NULL,
    "discordid" TEXT NOT NULL,

    PRIMARY KEY ("guildid", "discordid"),
    CONSTRAINT "MemberByGuildCache_guildid_fkey" FOREIGN KEY ("guildid") REFERENCES "Guild" ("guildid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guild" (
    "guildid" TEXT NOT NULL PRIMARY KEY,
    "ignorebots" BOOLEAN NOT NULL DEFAULT true,
    "lastmemberfetch" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "djs_members_uncached" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Guild" ("guildid", "ignorebots", "lastmemberfetch") SELECT "guildid", "ignorebots", "lastmemberfetch" FROM "Guild";
DROP TABLE "Guild";
ALTER TABLE "new_Guild" RENAME TO "Guild";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
