import { DiscordChannelBase } from "../discord-classes";
import { DiscordGuild } from "./DiscordGuild";
import { CachedManager } from "./util";
import { DiscordClient } from "../DiscordClient";

export class DiscordChannelManager extends CachedManager<DiscordChannelBase> {
    channelCountWithoutThreads = 0
    
    readonly guild: DiscordGuild


    async create(name: string) {
        return null // GuildChannel
    }

    private _fetch(id?: string) {
        if (!this.loaded) {
            this.guild.data.channels.forEach(c => {
                this.cache.set(c.id, c)
            })
            this.loaded = true
        }
        if (!id) return this.cache
        return this.resolve(id) ?? null
    }

    fetchAll() {
        return this._fetch() as Map<string, DiscordChannelBase>
    }

    fetch(id: string) {
        return this._fetch(id) as DiscordChannelBase | null
    }

    async fetchActiveThreads() {
        return null // FetchedThreads
    }


    constructor(guild: DiscordGuild) {
        super(guild.client)

        this.guild = guild
    }
}

export class DiscordChannel {
    readonly client: DiscordClient
    readonly data: DiscordChannelData

    get createdAt() { return DiscordClient.getCreatedAt(this) }

    deleted = false

    readonly id: string

    get type() { return this.data.type }


    async delete() {
        return this
    }

    isGuildChannel(): this is DiscordGuildChannel {
        return this.type === 0 || this.type === 5 || this.isVoice() === true || this.isThread() === true || this.isStore()
    }

    isStore(): this is DiscordStoreChannel {
        return this.type === 6
    }

    isText(): this is DiscordTextBasedChannel {
        return this.type === 0 || this.type === 1 || this.type === 3 || this.type === 5 || this.isThread()
    }

    isThread(): this is DiscordThreadChannel {
        return this.type === 10 || this.type === 11 || this.type === 12
    }

    isVoice(): this is DiscordVoiceChannel {
        return this.type === 2 || this.type === 13
    }




    constructor(client: DiscordClient, data: DiscordChannelData) {
        this.client = client
        this.data = data

        this.id = data.id
    }
}

export class DiscordGuildChannel extends DiscordChannel {
    readonly guild: DiscordGuild

    

    constructor(guild: DiscordGuild, data: DiscordChannelData) {
        super(guild.client, data)

        this.guild = guild
    }
}

export interface DiscordTextBasedChannel {

}

export interface DiscordThreadChannel {

}

export interface DiscordVoiceChannel {

}

export class DiscordStoreChannel extends DiscordGuildChannel {

}

export interface DiscordChannelData {
    id: string

    type: number
}