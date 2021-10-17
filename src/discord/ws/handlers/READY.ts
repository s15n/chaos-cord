import { setGuilds } from "../../../guildsbar/Guilds";
import { DiscordGuild } from "../../classes/DiscordGuild";
import { DiscordUserPartial } from "../../discord-classes";
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

    client.user = user as any
    console.log(client.user)

    let guilds: DiscordGuild[] = d.guilds.map(data => new DiscordGuild(client, data))

    const guildPositions = d.user_settings.guild_positions
    if (guildPositions.length !== 0) {
        const temp: DiscordGuild[] = []
        guildPositions.forEach((id, index) => {
            const guildIndex = guilds.findIndex(g => g.id === id)
            if (guildIndex !== -1) {
                temp[index] = guilds[guildIndex]
            }
        })
        for (let i = guilds.length - 1; i >= 0; --i) {
            const g = guilds[i]
            if (!temp.includes(g)) temp.unshift(g)
        }
        guilds = temp
    }

    client.setGuilds(guilds)
    setGuilds(guilds)

    //client.setUsers(d.users)

    console.log(`Logged in as: ${user.username}#${user.discriminator}`)

    client.emit('ready')

    return true;
}