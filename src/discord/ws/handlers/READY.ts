import { setGuilds } from "../../../guildsbar/Guilds";
import { DiscordGuild, DiscordUserPartial } from "../../discord-classes";
import { DiscordClient } from "../../DiscordClient";

export default function onReady(client: DiscordClient, d: {session_id: string, user: {username: string, discriminator: string}, guilds: any[], users: DiscordUserPartial[]}) {
    console.log(d);

    client.ws.sessionId = d.session_id

    const user = d.user
    const guilds: DiscordGuild[] = d.guilds
    console.log(guilds)
    client.setGuilds(guilds)
    setGuilds(guilds)

    client.setUsers(d.users)

    console.log(`Logged in as: ${user.username}#${user.discriminator}`)

    return true;
}