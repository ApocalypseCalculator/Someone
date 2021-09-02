import { EventHandler } from '../typings/bot';

export = {
    name: 'error',
    callback: (error: Error) => {
        console.log(error);
    },
} as EventHandler;