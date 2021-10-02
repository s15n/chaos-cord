import { DiscordChannelBase, DiscordUserPartial } from "../discord-classes";
import { DiscordGuild } from "./DiscordGuild";
import { DiscordRole } from "./DiscordRole";
import { CachedManager, DISCORD_IMAGE_BASE_URL, parseStaticImageURLOptions, StaticImageURLOptions } from "./util";

export class DiscordMemberManager extends CachedManager<DiscordMember> {

    constructor(guild: DiscordGuild) {
        super(guild.client)


    }
}

export class DiscordMember {
    readonly guild: DiscordGuild
    readonly data: DiscordMemberData

    readonly id: string

    bannable: undefined // boolean

    get client() { return this.guild.client }

    deleted: undefined // boolean

    get displayAvatar() { return this.guildAvatar ?? this.user?.avatar ?? null }

    get displayColor() { return this.roles.color?.color ?? 0 }

    get displayName() { return this.nickname ?? this.user?.username }

    get guildAvatar() { return this.data.avatar }

    get hoistedRoleId() { return this.data.hoisted_role }

    get joinedAt() { return this.data.joined_at }

    kickable: undefined // boolean

    get manageable() {
        if (this.id === this.guild.ownerId) return false
        //if (this.id === this.client.user.id) return false
        //if (this.client.user.id === this.guild.ownerId) return true
        //if (!this.guild.me) throw 'GUILD_UNCACHED_ME'
        //return this.guild.me.roles.highest.comparePositionTo(this.roles.highest) > 0
    }

    get nickname() { return this.data.nick ?? null }

    partial: undefined

    get pending() { return this.data.pending }

    get permissions() { return this.data.permissions }

    get premiumSince() { return this.data.premium_since }

    get presence() { return this.data.presence }

    private _roles: DiscordMemberRoleManager | undefined
    get roles() {
        if (this._roles) return this._roles
        return this._roles = new DiscordMemberRoleManager(this)
    }

    readonly user: DiscordUserPartial | undefined

    voice: undefined // VoiceState


    async ban(options: Partial<{ days: number, reason: string }>) {
        return this
    }

    async createDM() {
        return null // DMChannel
    }

    async deleteDM() {
        return null // DMChannel
    }

    displayAvatarURL(options?: Partial<StaticImageURLOptions>) {
        const avatar = this.displayAvatar
        return avatar ? `${DISCORD_IMAGE_BASE_URL}/avatars/${this.id}/${avatar}${parseStaticImageURLOptions(options)}` : this.user ? `${DISCORD_IMAGE_BASE_URL}/embed/avatars/${Number.parseInt(this.user.discriminator) % 5}.png` : null
    }

    async edit(data: Partial<DiscordMemberEditData>) {
        return this
    }

    async fetch() {
        return this
    }

    async kick(reason?: string) {
        return this
    }

    async permissionsIn(channel: DiscordChannelBase | string) {
        return null // Readonly<Permissions>
    }

    async send(options: string | { content: string } | {}) {
        return null // Message
    }

    async setNickname(nick: string | null) {
        return this
    }

    toString() {
        return `<@!${this.id}>`
    }


    constructor(guild: DiscordGuild, data: DiscordMemberData) {
        this.guild = guild
        this.data = data

        this.user = data.user
        this.id = this.user!.id
    }
}

export interface DiscordMemberData {
    user?: DiscordUserPartial
    nick?: string | null
    avatar: string | null
    roles: string[]
    joined_at: string
    premium_since?: string | null
    deaf: boolean
    mute: boolean
    pending?: boolean
    permissions?: string
    presence: any
    hoisted_role: string | null
}

interface DiscordMemberEditData {

}

export class DiscordMemberRoleManager extends CachedManager<DiscordRole> {
    botRole: undefined | DiscordRole | null

    private _color: DiscordRole | undefined
    get color() {
        if (this._color) return this._color
        const colorRoles = this.filter(r => r.color)
        if (!colorRoles.length) return null
        return this._color = colorRoles.reduce((prev, role) => (!prev || role.comparePositionTo(prev) > 0 ? role : prev))
    }

    get guild() { return this.member.guild }

    highest: undefined | DiscordRole

    hoist: undefined | DiscordRole

    readonly member: DiscordMember

    premiumSubscriberRole: undefined | DiscordRole


    async add(roleOrRoles: DiscordRole | string | Array<DiscordRole | string> | Map<string, DiscordRole>) {
        return this.member
    }

    async remove(roleOrRoles: DiscordRole | string | Array<DiscordRole | string> | Map<string, DiscordRole>) {
        return this.member
    }

    async set(roles: Array<DiscordRole | string> | Map<string, DiscordRole>) {
        return this.member
    }


    constructor(member: DiscordMember) {
        super(member.client)

        this.member = member

        member.data.roles.forEach(r => {
            const role = this.guild.roles.resolve(r)
            if (role) this.cache.set(r, role)
        })
        this.loaded = true
    }
}