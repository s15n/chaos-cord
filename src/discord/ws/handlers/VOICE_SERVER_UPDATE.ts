import { DiscordClient } from "../../DiscordClient";

export default function onMessageCreate(client: DiscordClient, d: {
    endpoint: string
    guild_id: string
    token: string
}, socket: WebSocket) {
    if (client.voiceServer) {
        client.voiceSessionId = undefined
        client.voiceWs?.close()
    }

    client.voiceServer = d

    console.log('VOICE SERVER FOUND: '+d.endpoint)

    if (client.voiceSessionId) {
        client.connectVoice()
    }
}