import { DiscordWs } from "../DiscordWs";

export default function onReady(ws: DiscordWs, d: {session_id: string, user: {username: string, discriminator: string}, guilds: any[]}) {
    console.log(d);

    ws.sessionId = d.session_id

    const user = d.user
    const guilds = d.guilds
    console.log(guilds)
    //setGuilds(guilds)

    console.log(`Logged in as: ${user.username}#${user.discriminator}`)

    return true;
}