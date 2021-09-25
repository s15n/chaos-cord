import { pushMessage } from "../../../chat/ChatArea";
import { DiscordMessageIn } from "../../discord-classes";
import { DiscordClient } from "../../DiscordClient";

export default function onMessageCreate(client: DiscordClient, d: DiscordMessageIn, socket: WebSocket) {
    console.log(d)
    console.log(`Message create: ${d.content}`)
    pushMessage(d)

    return true;
}