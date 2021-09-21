import { pushMessage } from "../../../chat/ChatArea";
import { DiscordClient } from "../../DiscordClient";

export default function onMessageCreate(client: DiscordClient, d: {content: string}, socket: WebSocket) {
    console.log(d)
    console.log(`Message create: ${d.content}`)
    pushMessage(d)

    return true;
}