import { handleEvent } from "./DiscordEvents";

export let discordLatency: number | null = null;

let discordSessionId: string;

export function setDiscordSessionId(id: string) {
    discordSessionId = id;
}
let socket: WebSocket;

export function discordLogin(resume=false) {
    console.log(resume ? 'Resuming...': 'Discord login start');

    socket = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json');

    socket.addEventListener('open', () => {
        console.log('Connected wo websocket');
    });

    let hbInterval: number;
    let hbTimerId: number;
    let lastHb: number;
    let sequenceId: number | null = null;
    
    socket.addEventListener('message', event => {
        const object = JSON.parse(event.data);
        const op = object.op;
        const t = object.t;
        const s = object.s;
        const d = object.d;

        switch (op) {
        case 10:
            // Manage heartbeats
            hbInterval = d.heartbeat_interval;
            hbTimerId = window.setInterval(() => {
                /*if (socket.clo) {
                    console.log('Heartbeat: Connection was closed')
                    window.clearInterval(hbTimerId);
                    return;
                }*/
                console.log('Heartbeat...');
                lastHb = heartbeat(sequenceId);
            }, hbInterval);

            // Identify
            console.log('Identifying');
            socket.send(JSON.stringify({
                op: 2,
                d: {
                    token: 'ODg3MzM4OTU4NDUzODY2NTU3.YUCs2A.XZz40Vz7W5foc3vYrrhG0Zhs6ts',
                    capabilities: 125,
                    properties: {
                        os: 'Windows',
                        browser: 'Chrome'
                    }
                }
            }));

            break;
        case 11:
            discordLatency = Date.now() - lastHb;
            console.log(`...Received (latency: ${discordLatency})`);
            break;
        case 0:
            sequenceId = s;
    
            if (handleEvent(t, d, socket)) break; else {
                console.log(`Unknown event:`);
                console.log(object);
                break;
            }
        default:
            console.log(`Unknown event:`);
            console.log(object);
        }
    });

    socket.addEventListener('close', event => {
        console.log('Connection closed');
        console.log(event);
        if (event.code === 1000) {
            console.log('Website closed connection');
            return;
        }
        discordLogin(true);
        window.clearInterval(hbTimerId);
        return;
    });

    return socket;
}

export function discordClose() {
    if (!socket) return;
    console.log('Shutting down discord');
    socket.close(1000);
}

function heartbeat(sequenceId: number | null) {
    socket.send(JSON.stringify({
        op: 1,
        d: sequenceId
    }));
    console.log('Heartbeating...');
    return Date.now();
}