import { DiscordClient } from "../../DiscordClient";

const EVENTS = {
    READY: 'ready',
    MESSAGE_CREATE: 'messageCreate',
    GUILD_MEMBERS_CHUNK: 'guildMembersChunk',
    GUILD_MEMBER_LIST_UPDATE: 'guildMemberListUpdate'
}

type Handler = Promise<(client: DiscordClient, d: any) => void>

const handlers = new Map<DiscordEvent, Handler>()

for (const name in EVENTS) {
    handlers.set(name as DiscordEvent, import(`./${name}.ts`).then((v) => v.default as Handler))
}

export { handlers };

export type DiscordEvent = keyof typeof EVENTS

export function isDiscordEventType(t: string): t is DiscordEvent {
    return t in EVENTS
}