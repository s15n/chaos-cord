import { DiscordWs } from "../DiscordWs";

const EVENTS = {
    READY: 'ready',
    MESSAGE_CREATE: 'messageCreate'
}

type Handler = Promise<(ws: DiscordWs, d: any) => void>

const handlers = new Map<DiscordEvent, Handler>()

for (const name in EVENTS) {
    handlers.set(name as DiscordEvent, import(`./${name}.ts`).then((v) => v.default as Handler))
}

export { handlers };

export type DiscordEvent = keyof typeof EVENTS

export function isDiscordEventType(t: string): t is DiscordEvent {
    return t in EVENTS
}