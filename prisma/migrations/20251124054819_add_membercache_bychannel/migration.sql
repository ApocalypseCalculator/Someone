-- CreateTable
CREATE TABLE "MemberByChannel" (
    "channelid" TEXT NOT NULL,
    "discordid" TEXT NOT NULL,

    PRIMARY KEY ("channelid", "discordid"),
    CONSTRAINT "MemberByChannel_channelid_fkey" FOREIGN KEY ("channelid") REFERENCES "Channel" ("channelid") ON DELETE RESTRICT ON UPDATE CASCADE
);
