# Someone
## ABOUT THE BOT

The legendary Someone bot for Discord. Brings back Discord's 2018 April Fools joke. 

## WHAT THE BOT DOES

When you mention the bot, it will randomly mention some other server member *who can see the channel*. It also has a lot of other commands you can get by doing `/help`.

## SELF-HOSTING

1. Clone this repository onto your PC (`git clone https://github.com/ApocalypseCalculator/Someone`) and run `npm run setup`. 

2. Inside the `.env` file, input your bot token as `TOKEN`,  Prisma DB connection URL `DATABASE_URL`, and `REGISTER_CMDS`. If hosting for multiple servers, `REGISTER_CMDS="global"` (takes up to 30min), otherwise, `REGISTER_CMDS="guild"` (instant). `REGISTER_CMDS` can be removed after the first run registers the commands. 

3. Run `npm run start`, or you can compile with `tsc` and run the JS output

## USING THE BOT

This bot duplicates the @Someone April Fools joke. To use it, simply ping the bot (you should name the bot Someone to make it simple).

You can use `/commands` for a list of commands.

If you get a *webhook max length exceeded* error message, simply run the command `/whclear` to clear out the webhooks managed by Someone.

Make sure to grant the bot privileges to create webhooks, manage messages, and view channels or it may not run properly.

If there are any bugs, feel free to contact me through Discord in our [support server](https://discord.gg/5WmPnYx)

**You can find a hosted version of this bot at [top.gg](https://top.gg/bot/705135432588853288), and while you're there, please vote for my bot.**

![Demo GIF](https://github.com/user-attachments/assets/6fd3226f-33ca-41d6-97ab-a09ebc91c96f)


## LEGAL

[Privacy policy and terms & conditions](https://github.com/ApocalypseCalculator/Someone/tree/master/legal) apply if using hosted version of the bot. 

## CONTRIBUTORS
- [Terrarian](https://github.com/Terra-rian) (the GOAT for rewriting the original bot into TypeScript + updating to slash commands)
