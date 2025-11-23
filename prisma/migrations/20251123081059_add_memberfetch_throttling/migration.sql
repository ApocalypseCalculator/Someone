-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guild" (
    "guildid" TEXT NOT NULL PRIMARY KEY,
    "ignorebots" BOOLEAN NOT NULL DEFAULT true,
    "lastmemberfetch" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Guild" ("guildid", "ignorebots") SELECT "guildid", "ignorebots" FROM "Guild";
DROP TABLE "Guild";
ALTER TABLE "new_Guild" RENAME TO "Guild";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
