import { pushMessage } from "../../../chat/ChatArea";
import { DiscordWs } from "../DiscordWs";

export default function onMessageCreate(ws: DiscordWs, d: {content: string}, socket: WebSocket) {
    console.log(d)
    console.log(`Message create: ${d.content}`)
    pushMessage(d)

    return true;
}