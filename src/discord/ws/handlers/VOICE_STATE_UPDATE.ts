import { DiscordClient } from "../../DiscordClient";

export default function onMessageCreate(client: DiscordClient, d: {
    user_id: string
    session_id: string
}, socket: WebSocket) {
    if (client.user?.id !== d.user_id) {
        console.log('Voice State Update')
        console.log(d)
        return
    }

    if (client.voiceSessionId) {
        client.voiceServer = undefined
        client.voiceWs?.close()
    }

    client.voiceSessionId = d.session_id

    if (client.voiceServer) {
        client.connectVoice()
    }
}