import { pushMessage } from "../../../chat/ChatArea";
import { DiscordMessage, DiscordMessageData } from "../../classes/DiscordMessage";
import { DiscordClient } from "../../DiscordClient";

export default function onMessageCreate(client: DiscordClient, d: DiscordMessageData, socket: WebSocket) {
    //console.log(d)
    //console.log(`Message create: ${d.content}`)
    pushMessage(new DiscordMessage(client, d))

    return true;
}