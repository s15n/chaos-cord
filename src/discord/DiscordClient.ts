import { DiscordGuild } from "./classes/DiscordGuild";
import { CachedManager } from "./classes/util";
import { DiscordUserPartial } from "./discord-classes";
import { DiscordVoiceWs } from "./voice/DiscordVoiceWs";
import { DiscordWs } from "./ws/DiscordWs";

export class DiscordClient {
    token: string
    constructor(token: string) {
        this.token = token
    }

    readonly ws = new DiscordWs(this)

    guilds: CachedManager<DiscordGuild> = new CachedManager(this)

    setGuilds(guilds: DiscordGuild[]) {
        this.guilds.clear()
        guilds.forEach(g => {
            this.guilds.cache.set(g.id, g)
        })
    }

    getGuild(id: string) {
        return this.guilds.resolve(id)
    }

    login() {
        this.ws.login(this.token)
    }

    close() {
        this.voiceWs?.close()
        this.ws.close()
    }

    user: DiscordUserPartial | undefined
    voiceSessionId: string | undefined
    voiceServer: { endpoint: string, guild_id: string, token: string } | undefined
    voiceWs: DiscordVoiceWs | undefined

    connectVoice() {
        /*if (this.user) {
            console.error('NO USER ID');
            return
        }*/
        this.voiceWs = new DiscordVoiceWs(this.voiceSessionId!, this.user!.id, this.voiceServer!)
        this.voiceWs.connect()
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