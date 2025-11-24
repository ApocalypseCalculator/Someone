import { Message, ClientEvents, CommandInteraction, ApplicationCommandOptionData, InteractionResponse, ChatInputCommandInteraction } from 'discord.js';
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
     * The slash command options.
     */
    options: ApplicationCommandOptionData[];
    /**
     * The actual stuff the command will do.
     */
    execute: (interaction: ChatInputCommandInteraction, client?: Someone) => Promise<InteractionResponse | Message>;
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