import { EventHandler } from '../typings/bot';
import { config } from '../assets/config';

export = {
    name: 'ready',
    callback: () => {
        // @ts-ignore
        console.log(`Logged in as ${this.user.tag}!`);
        // @ts-ignore
        this.user.setPresence({
            activities: [{
                type: 'WATCHING',
                name: ` for ${config.prefix}help`,
            }],
            status: 'online',
        });
    },
} as EventHandler;