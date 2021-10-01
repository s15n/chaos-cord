import { DiscordGuild } from "./classes/DiscordGuild";
import { DiscordUserPartial } from "./discord-classes";
import { DiscordWs } from "./ws/DiscordWs";

export class DiscordClient {
    token: string
    constructor(token: string) {
        this.token = token
    }

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
        return guild.data.roles.find(r => r.id === id)
    }

    static request(
        method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT', 
        route: string[], 
        data?: {}, 
        json: boolean | undefined = true, 
        query: string[] = [], 
        api: string = API_ROOT
    ) {
        const token = window.localStorage.getItem('token')!
        return fetch(`https://${api}/${route.join('/')}${query.length !== 0 ? `?${query.join('&')}` : ""}`, {
            method: method,
            body: data ? JSON.stringify(data) : undefined,
            headers: {
                'Authorization': token,
                ...(json ? { 'Content-Type':'application/json' } : undefined)
            }
        })
    }

    static getSnowflakeCreatedAt(snowflake: string) {
        const dec = Number.parseInt(snowflake)
        return (dec >> 22) + 1420070400000
    }

    static getCreatedAt({ id }: { id: string }) {
        return this.getSnowflakeCreatedAt(id)
    }
}

const API_ROOT = "discord.com/api/v9"

class DiscordGuildPlus {
    client: DiscordClient
    data: DiscordGuild
    constructor(client: DiscordClient, data: DiscordGuild) {
        this.client = client
        this.data = data
    }

    members: any[] = []
}