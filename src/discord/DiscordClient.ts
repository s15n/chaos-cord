import { EventEmitter } from "./EventEmitter";
import { DiscordGuild } from "./classes/DiscordGuild";
import { CachedManager } from "./classes/util";
import { DiscordUserPartial } from "./discord-classes";
import { DiscordVoiceWs } from "./voice/DiscordVoiceWs";
import { DiscordWs } from "./ws/DiscordWs";
import { DiscordMessage } from "./classes/DiscordMessage";

export class DiscordClient extends EventEmitter<DiscordClientEvents> {
    token: string
    constructor(token: string) {
        super()
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

/*interface TypedEventEmitter {
    on<K extends keyof DiscordClientEvents>(event: K, listener: (...args: DiscordClientEvents[K]) => void): this
    on<S extends string | symbol>(event: Exclude<S, keyof DiscordClientEvents>, listener: (...args: any[]) => void): this;
}*/

export interface DiscordClientEvents {
    [key: string]: [...any] | any[]

    ready: []
    message_create: [message: DiscordMessage]
}

const API_ROOT = "discord.com/api/v9"