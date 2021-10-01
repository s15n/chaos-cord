import { DiscordChannelBase } from "../discord-classes";
import { DiscordClient } from "../DiscordClient";
import { DiscordGuild } from "./DiscordGuild";
import { CachedManager } from "./util";

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

    


    constructor(client: DiscordClient, guild: DiscordGuild) {
        super(client)

        this.guild = guild
    }
}