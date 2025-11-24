/*
  Warnings:

  - You are about to alter the column `time` on the `Error` table. The data in that column could be lost. The data in that column will be cast from `Int` to `DateTime`.
  - You are about to alter the column `lastmemberfetch` on the `Guild` table. The data in that column could be lost. The data in that column will be cast from `Int` to `DateTime`.
  - You are about to alter the column `lastping` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int` to `DateTime`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Error" (
    "errid" TEXT NOT NULL PRIMARY KEY,
    "error" TEXT NOT NULL,
    "time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guild" TEXT NOT NULL,
    "channelid" TEXT NOT NULL,
    "discordid" TEXT NOT NULL,
    "command" TEXT NOT NULL
);
INSERT INTO "new_Error" ("channelid", "command", "discordid", "errid", "error", "guild", "time") SELECT "channelid", "command", "discordid", "errid", "error", "guild", "time" FROM "Error";
DROP TABLE "Error";
ALTER TABLE "new_Error" RENAME TO "Error";
CREATE TABLE "new_Guild" (
    "guildid" TEXT NOT NULL PRIMARY KEY,
    "ignorebots" BOOLEAN NOT NULL DEFAULT true,
    "lastmemberfetch" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Guild" ("guildid", "ignorebots", "lastmemberfetch") SELECT "guildid", "ignorebots", "lastmemberfetch" FROM "Guild";
DROP TABLE "Guild";
ALTER TABLE "new_Guild" RENAME TO "Guild";
CREATE TABLE "new_User" (
    "discordid" TEXT NOT NULL PRIMARY KEY,
    "lastping" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pinged" INTEGER NOT NULL
);
INSERT INTO "new_User" ("discordid", "lastping", "pinged") SELECT "discordid", "lastping", "pinged" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
