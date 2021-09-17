import { DiscordEventType, DiscordIdentify, DiscordResume, DiscordSocketPayload } from "./discord-classes"
import { handleEvent } from "./DiscordEvents"

export let discordLatency: number | null = null

let socket: WebSocket

let sessionId: string

export function setDiscordSessionId(id: string) {
    sessionId = id
}

export function discordLogin(resume: boolean = false) {
    console.log(resume ? 'Resuming...': 'Discord login start')

    socket = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json') //TODO: get gateway

    socket.addEventListener('open', () => {
        console.log('Connected wo websocket')
    })

    let hbInterval: number
    let hbTimerId: number
    let lastHb: number
    let sequenceId: number | null = null

    socket.addEventListener('message', event => {
        const object: any = JSON.parse(event.data)
        const op: number = object.op
        const t: DiscordEventType = object.t
        const s: number = object.s
        const d: any = object.d

        switch (op) {
        case 10:
            // Manage heartbeats
            hbInterval = d.heartbeat_interval
            hbTimerId = window.setInterval(() => {
                console.log('Heartbeat...')
                lastHb = heartbeat(sequenceId)
            }, hbInterval)

            // Identify
            if (!resume) {
                console.log('Identifying')
                socket.send(JSON.stringify({
                    op: 2,
                    d: {
                        token: 'ODg3MzM4OTU4NDUzODY2NTU3.YUCs2A.XZz40Vz7W5foc3vYrrhG0Zhs6ts',
                        capabilities: 125,
                        presence: {
                            activities: [],
                            afk: false,
                            status: 'online'
                        },
                        properties: {
                            os: 'Windows',
                            browser: 'Chrome'
                        }
                    }
                } as DiscordSocketPayload<DiscordIdentify>))
            } else {
                socket.send(JSON.stringify({
                    op: 6,
                    d: {
                        token: 'ODg3MzM4OTU4NDUzODY2NTU3.YUCs2A.XZz40Vz7W5foc3vYrrhG0Zhs6ts',
                        session_id: sessionId,
                        seq: sequenceId
                    }
                } as DiscordSocketPayload<DiscordResume>))
            }

            break;
        case 11:
            discordLatency = Date.now() - lastHb
            console.log(`...Received (latency: ${discordLatency})`)
            break
        case 0:
            sequenceId = s
    
            if (!handleEvent(t, d, socket)) logUnknownEvent(object)
            break
        default:
            logUnknownEvent(object)
        }
    });
}

function logUnknownEvent(event: {}) {
    console.log('Unknown event:')
    console.log(event);
}

export function discordClose() {
    if (!socket) return
    console.log('Shutting down discord')
    socket.close(1000)
}

function heartbeat(sequenceId: number | null) {
    socket.send(JSON.stringify({
        op: 1,
        d: sequenceId
    }))
    return Date.now()
}