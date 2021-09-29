import { setGuilds } from "../../../guildsbar/Guilds";
import { DiscordGuild, DiscordUserPartial } from "../../discord-classes";
import { DiscordClient } from "../../DiscordClient";

export default function onReady(client: DiscordClient, d: {
    session_id: string
    user: {
        username: string
        discriminator: string
    }
    guilds: any[]
    users: DiscordUserPartial[]
    user_settings: {
        guild_positions: string[]
    }
}) {
    console.log(d);

    client.ws.sessionId = d.session_id

    const user = d.user
    let guilds: DiscordGuild[] = d.guilds

    const guildPositions = d.user_settings.guild_positions
    if (guildPositions.length !== 0) {
        const temp: DiscordGuild[] = []
        guildPositions.forEach((id, index) => {
            const guildIndex = guilds.findIndex(g => g.id === id)
            if (guildIndex !== -1) {
                temp[index] = guilds[guildIndex]
            }
        })
        guilds = temp
    }

    client.setGuilds(guilds)
    setGuilds(guilds)

    client.setUsers(d.users)

    console.log(`Logged in as: ${user.username}#${user.discriminator}`)

    return true;
}