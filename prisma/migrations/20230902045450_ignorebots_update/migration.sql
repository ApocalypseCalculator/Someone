-- CreateTable
CREATE TABLE "Channel" (
    "channelid" TEXT NOT NULL PRIMARY KEY,
    "guild" TEXT NOT NULL,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "webhook" TEXT
);

-- CreateTable
CREATE TABLE "Guild" (
    "guildid" TEXT NOT NULL PRIMARY KEY,
    "ignorebots" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "User" (
    "discordid" TEXT NOT NULL PRIMARY KEY,
    "lastping" INTEGER NOT NULL,
    "pinged" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Error" (
    "errid" TEXT NOT NULL PRIMARY KEY,
    "error" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "guild" TEXT NOT NULL,
    "channelid" TEXT NOT NULL,
    "discordid" TEXT NOT NULL,
    "command" TEXT NOT NULL
);
