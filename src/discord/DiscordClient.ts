import { DiscordGuild } from "./discord-classes";
import { DiscordWs } from "./ws/DiscordWs";

export class DiscordClient {
    readonly ws = new DiscordWs(this)

    private guilds: Map<string, DiscordGuild> = new Map()

    setGuilds(guilds: DiscordGuild[]) {
        this.guilds.clear()
        guilds.forEach(g => {
            this.guilds.set(g.id, g)
        })
    }

    getGuild(id: string) {
        return this.guilds.get(id)
    }

    login() {
        this.ws.login()
    }

    close() {
        this.ws.close()
    }

    static getRole(guild: DiscordGuild | undefined, id: string) {
        if (!guild) return undefined
        return guild.roles.find(r => r.id === id)
    }
}