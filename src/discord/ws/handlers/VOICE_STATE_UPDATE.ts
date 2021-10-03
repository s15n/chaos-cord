import { setVoiceState } from "../../../App";
import { DiscordClient } from "../../DiscordClient";

export default function onMessageCreate(client: DiscordClient, d: {
    user_id: string
    session_id: string
    channel_id: string | null
}, socket: WebSocket) {
    if (client.user?.id !== d.user_id) {
        console.log('Voice State Update')
        console.log(d)
        return
    }
    
    if (d.channel_id === null) {
        console.log(`Ended voice session ${d.session_id}`)
        return
    }

    if (client.voiceSessionId) {
        client.voiceServer = undefined
        client.voiceWs?.close()
    }

    client.voiceSessionId = d.session_id

    if (client.voiceServer) {
        setVoiceState({ state: 'BOTH' })
        client.connectVoice()
    } else {
        setVoiceState({ state: 'STATE' })
    }
}