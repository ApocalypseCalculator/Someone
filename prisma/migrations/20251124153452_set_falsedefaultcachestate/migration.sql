-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guild" (
    "guildid" TEXT NOT NULL PRIMARY KEY,
    "ignorebots" BOOLEAN NOT NULL DEFAULT true,
    "lastmemberfetch" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "djs_members_uncached" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Guild" ("djs_members_uncached", "guildid", "ignorebots", "lastmemberfetch") SELECT "djs_members_uncached", "guildid", "ignorebots", "lastmemberfetch" FROM "Guild";
DROP TABLE "Guild";
ALTER TABLE "new_Guild" RENAME TO "Guild";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
