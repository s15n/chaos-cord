import { pushMessage } from "../chat/ChatArea";
import { setDiscordSessionId } from "./DiscordMain";

let user;
let guilds;

export function handleEvent(t: string, d: any, socket: WebSocket) {
    switch (t) {
    case 'READY':
        return handleReady(d, socket);
    case 'MESSAGE_CREATE':
        return handleMessageCreate(d, socket);
    }
    return false;
}

function handleReady(d: {session_id: string, user: {username: string, discriminator: string}, guilds: any[]}, socket: WebSocket) {
    console.log(d);

    setDiscordSessionId(d.session_id);

    user = d.user;
    guilds = d.guilds;

    console.log(`Logged in as: ${user.username}#${user.discriminator}`);

    return true;
}


function handleMessageCreate(d: {content: string}, socket: WebSocket) {
    console.log(d);
    console.log(`Message create: ${d.content}`);
    pushMessage(d);

    return true;
}