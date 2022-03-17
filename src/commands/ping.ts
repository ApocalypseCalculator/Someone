import { Command } from '../typings/bot';

export = {
    name: 'ping',
    verify: () => {
        return true;
    },
    execute: async (msg, _args, client) => {
        return msg.reply('poooong').then((message) => {
            return message.edit(`Pong! Latency is ${Math.floor(message.createdAt.getMilliseconds() - msg.createdAt.getMilliseconds())}ms. API Latency is ${Math.round(client?.ws.ping ?? 50)}ms`);
        });
    },
} as Command;