import { DiscordGuild } from "../classes/DiscordGuild";
import { DiscordChannel } from "../discord-classes";
import { DiscordWs } from "../ws/DiscordWs";

export function discordConnectVoice(ws: DiscordWs, guild: DiscordGuild, channel: DiscordChannel<2>) {
    ws.send(4, {
        guild_id: guild.id,
        channel_id: channel.id,
        self_mute: true,
        self_deaf: true,
        self_video: false
    })
}