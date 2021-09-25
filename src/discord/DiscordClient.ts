import { DiscordGuild, DiscordUserPartial } from "./discord-classes";
import { Rest } from "./rest/Rest";
import { DiscordWs } from "./ws/DiscordWs";

export class DiscordClient {
    token: string
    constructor(token: string) {
        this.token = token
    }

    readonly rest = new Rest(this)
    readonly ws = new DiscordWs(this)

    private guilds: Map<string, DiscordGuildPlus> = new Map()
    private users: Map<string, DiscordUserPartial> = new Map()

    setGuilds(guilds: DiscordGuild[]) {
        this.guilds.clear()
        guilds.forEach(g => {
            this.guilds.set(g.id, new DiscordGuildPlus(this, g))
        })
    }

    getGuild(id: string) {
        return this.getGuildPlus(id)?.data
    }

    getGuildPlus(id: string) {
        return this.guilds.get(id)
    }

    setUsers(users: DiscordUserPartial[]) {
        this.users.clear()
        users.forEach(u => this.users.set(u.id, u))
    }

    get userIds() {
        const a: string[] = []
        this.users.forEach(u => a.push(u.id))
        return a
    }

    getUser(id: string) {
        return this.users.get(id)
    }

    login() {
        this.ws.login(this.token)
    }

    close() {
        this.ws.close()
    }

    static getRole(guild: DiscordGuild | undefined, id: string) {
        if (!guild) return undefined
        return guild.roles.find(r => r.id === id)
    }
}

class DiscordGuildPlus {
    client: DiscordClient
    data: DiscordGuild
    constructor(client: DiscordClient, data: DiscordGuild) {
        this.client = client
        this.data = data
    }

    members: any[] = []
}