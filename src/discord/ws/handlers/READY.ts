import { setGuilds } from "../../../guildsbar/Guilds";
import { DiscordGuild } from "../../discord-classes";
import { DiscordClient } from "../../DiscordClient";

export default function onReady(client: DiscordClient, d: {session_id: string, user: {username: string, discriminator: string}, guilds: any[]}) {
    console.log(d);

    client.ws.sessionId = d.session_id

    const user = d.user
    const guilds: DiscordGuild[] = d.guilds
    console.log(guilds)
    client.guilds = guilds
    setGuilds(guilds)

    console.log(`Logged in as: ${user.username}#${user.discriminator}`)

    return true;
}