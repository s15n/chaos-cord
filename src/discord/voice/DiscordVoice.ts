import { setVoiceState } from "../../App";
import { DiscordGuild } from "../classes/DiscordGuild";
import { DiscordChannel } from "../discord-classes";
import { DiscordClient } from "../DiscordClient";
import { DiscordWs } from "../ws/DiscordWs";
import { DiscordVoiceWs } from "./DiscordVoiceWs";

export function discordConnectVoice(ws: DiscordWs, guild: DiscordGuild, channel: DiscordChannel<2>) {
    ws.send(4, {
        guild_id: guild.id,
        channel_id: channel.id,
        self_mute: false,
        self_deaf: false,
        self_video: false
    })
    setVoiceState({
        channel: channel,
        state: 'NONE',
        vws: null
    })
}

export function discordDisconnectVoice(client: DiscordClient) {
    client.voiceSessionId = undefined
    client.voiceServer = undefined
    client.voiceWs?.close()
    client.ws.send(4, {
        guild_id: null,
        channel_id: null,
        self_mute: false,
        self_deaf: false,
        self_video: false
    })
}

export interface DiscordVoiceState {
    channel: DiscordChannel<2>
    state: 'NONE' | 'STATE' | 'SERVER' | 'BOTH' | 'VWS' | 'VWS_READY' | 'CONNECTED'
    vws: DiscordVoiceWs | null
}