import { pushMessage } from "../../../chat/ChatArea";
import { DiscordMessage, DiscordMessageData } from "../../classes/DiscordMessage";
import { DiscordClient } from "../../DiscordClient";

export default function onMessageCreate(client: DiscordClient, d: DiscordMessageData, socket: WebSocket) {
    //console.log(d)
    //console.log(`Message create: ${d.content}`)
    const message = new DiscordMessage(client, d)
    pushMessage(message)

    client.emit('message_create', message)

    return true;
}