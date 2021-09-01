/* eslint-disable no-unused-vars */
import { PermissionResolvable, RoleResolvable, Message, ClientEvents, CommandInteraction, CommandInteractionOption, User } from 'discord.js';

export interface Command {
    /**
     * Name of the command.
     */
    name: string;
    /**
     * Does this command require any user permissions?
     */
    permissions?: PermissionResolvable[];
    /**
     * The actual stuff the command will perform.
     */
    execute: (msg: Message, args?: string[], client?: Someone) => Promise<Message | void>;
}

export interface EventHandler {
    /**
     * Name of event.
     */
    name: keyof ClientEvents;
    /**
     * Run only once?
     */
    once?: boolean;
    /**
     * Event callback
     * @this {this} `this` in the callback refers to the Someone client.
     */
    callback: <K extends keyof ClientEvents>(...args: ClientEvents[K]) => Promise<void>;
}