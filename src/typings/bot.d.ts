/* eslint-disable no-unused-vars */
import { PermissionResolvable, RoleResolvable, Message, ClientEvents, CommandInteraction, CommandInteractionOption, User } from 'discord.js';
import { Someone } from '..';

export interface Command {
    /**
     * Name of the command.
     */
    name: string;
    /**
     * Does this command require anything?
     */
    verify: (msg?: Message) => boolean;
    /**
     * The actual stuff the command will perform.
     */
    execute: (msg: Message, args?: string[], client?: Someone) => Promise<Message | void>;
}

export interface SlashCommand {
    /**
     * Name of the slash command.
     */
    name: string;
    /**
     * The command description.
     */
    description: string;
    /**
     * Is the command global, or for a specific guild only?
     */
    global: boolean;
    /**
     * The slash command options.
     */
    options: CommandInteractionOption[];
    /**
     * The actual stuff the command will do.
     */
    execute: (interaction: CommandInteraction, client?: Someone) => Promise<void>;
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