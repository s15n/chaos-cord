import { DiscordGuild } from "./discord-classes";
import { DiscordWs } from "./ws/DiscordWs";

export class DiscordClient {
    readonly ws = new DiscordWs(this)

    guilds: DiscordGuild[] = []

    login() {
        this.ws.login()
    }

    close() {
        this.ws.close()
    }
}