import { DiscordChannelBase } from "../discord-classes";
import { DiscordClient } from "../DiscordClient";
import { DiscordGuild } from "./DiscordGuild";
import { CachedManager } from "./util";

export class DiscordRoleManager extends CachedManager<DiscordRole> {
    readonly guild: DiscordGuild

    constructor(guild: DiscordGuild) {
        super(guild.client)
        this.guild = guild

        this.guild.data.roles.forEach((r, i) => {
            this.cache.set(r.id, new DiscordRole(this.guild, r, i))
        })
        this.loaded = true
    }
}

export class DiscordRole {
    readonly client: DiscordClient
    readonly guild: DiscordGuild
    readonly data: DiscordRoleData

    readonly id: string

    get color() { return this.data.color }

    get createdAt() { return DiscordClient.getCreatedAt(this) }

    deleted = false

    editable: undefined // boolean

    get hoist() { return this.data.hoist }

    get managed() { return this.data.managed }

    get mentionable() { return this.data.mentionable }

    get name() { return this.data.name }

    get position() { return this.data.position }

    readonly rawPosition: number

    get tags() { return this.data.tags }


    comparePositionTo(role: DiscordRole | string) {
        const resolved = typeof role === 'string' ? null : role
        if (!resolved) return 0 // TODO
        return this.position - resolved.position
    }

    async delete() {
        return this
    }

    async edit(data: Partial<DiscordRoleEditData>) {
        return this
    }

    permissionsIn(channel: DiscordChannelBase | string) {
        return null // Readonly<Permissions>
    }

    async setColor(color: number) {
        return this
    }

    async setHoist(hoist: boolean) {
        return this
    }

    async setMentionable(mentionable: boolean) {
        return this
    }

    async setName(name: string) {
        return this
    }

    async setPermissions(permissions: null /*PermissionResolvable*/) {
        return this
    }

    async setPosition(position: number) {
        return this
    }

    toString() {
        return `<@&${this.id}>`
    }


    static comparePositions(role1: DiscordRole, role2: DiscordRole) {
        return role1.comparePositionTo(role2)
    }


    constructor(guild: DiscordGuild, data: DiscordRoleData, rawPosition: number) {
        this.guild = guild
        this.client = this.guild.client
        this.data = data
        this.rawPosition = rawPosition

        this.id = data.id
    }
}

export interface DiscordRoleData {
    tags?: {
        botId?: string
        integrationId?: string
        premiumSubscriberRole?: true
    }
    position: number
    permissions: string
    name: string
    mentionable: boolean
    managed: boolean
    id: string
    icon: string | null
    hoist: boolean
    color: number
}

interface DiscordRoleEditData {

}