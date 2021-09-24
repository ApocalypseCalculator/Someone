import { EventHandler } from '../typings/bot';
import { config } from '../assets/config';
import { Someone } from '..';

export = {
    name: 'ready',
    callback: () => {
        const self = this as unknown as Someone;

        console.log('Connected to Discord!');

        self.user?.setPresence({
            activities: [{
                type: 'WATCHING',
                name: ` for ${config.prefix}help`,
            }],
            status: 'online',
        });
    },
} as EventHandler;