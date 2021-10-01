import { DiscordChannel, DiscordChannelBase, DiscordRole } from "../discord-classes";
import { DiscordClient } from "../DiscordClient";
import { DiscordChannelManager } from "./DiscordChannel";
import { DISCORD_IMAGE_BASE_URL, parseStaticImageURLOptions, StaticImageURLOptions } from "./util";

export class DiscordGuild {
    client: DiscordClient
    data: DiscordGuildData

    private _afkChannel: DiscordChannel<4> | undefined
    get afkChannel(): DiscordChannel<4> | null {
        if (this._afkChannel) return this._afkChannel
        return null // TODO
    }

    get afkChannelId() { return this.data.afk_channel_id }
    set afkChannelId(id: string | null) {
        this.data.afk_channel_id = id
        // TODO
    }

    get afkTimeout() { return this.data.afk_timeout }
    set afkTimeout(timeout: number | null) {
        this.data.afk_timeout = timeout
        // TODO
    }

    get banner() { return this.data.banner }
    set banner(banner: string | null) {
        this.data.banner = banner
        // TODO
    }

    bans: undefined // GuildBanManager

    readonly channels: DiscordChannelManager

    commands: undefined // GuildApplicationCommandManager

    get createdAt() { return DiscordClient.getCreatedAt(this) }

    get defaultMessageNotifications() { return this.data.default_message_notifications }
    // set

    get description() { return this.data.description }
    // set

    get discoverySplash() { return this.data.discovery_splash }
    // set

    emojis: undefined // GuildEmojiManager

    get explicitContentFilter() { return this.data.explicit_content_filter }
    // set

    get features() { return this.data.features }

    get icon() { return this.data.icon }
    // set

    readonly id: string

    ivites: undefined // GuildInviteManager

    get joinedAt() { return this.data.joined_at }

    get large() { return this.data.large }

    get maximumMembers() { return this.data.max_members }

    private _me: any | undefined
    get me(): any {
        if (this._me) return this._me
        return null // TODO
    }

    get memberCount() { return this.data.member_count }

    members: undefined // GuildMemberManager

    get mfaLevel() { return this.data.mfa_level }
    // set

    get name() { return this.data.name }
    // set

    get nameAcronym() { return this.name.split(' ').map(w => w[0].toUpperCase()).join('') }

    get nsfwLevel() { return this.data.nsfw_level }
    // set

    get ownerId() { return this.data.owner_id }
    // set

    partnered: boolean

    get preferredLocale() { return this.data.preferred_locale }
    // set

    get premiumSubscriptionCount() { return this.data.premium_subscription_count }

    get premiumTier() { return this.data.premium_tier }

    presences: undefined // PresenceManager

    get publicUpdatesChannelId() { return this.data.public_updates_channel_id }
    // set

    roles: undefined // RoleManager

    private _rulesChannel: DiscordChannel<0> | undefined
    get rulesChannel(): DiscordChannel<0> | null {
        if (this._rulesChannel) return this._rulesChannel
        return null // TODO
    }

    get rulesChannelId() { return this.data.rules_channel_id }
    // set

    get splash() { return this.data.splash }

    stageInstances: undefined // StageInstanceManager

    stickers: undefined // GuildStickerManager

    private _systemChannel: DiscordChannel<0> | undefined
    get systemChannel(): DiscordChannel<0> | null {
        if (this._systemChannel) return this._systemChannel
        return null // TODO
    }

    get systemChannelFlags() { return this.data.system_channel_flags }

    get systemChannelId() { return this.data.system_channel_id }
    // set

    get vanityUrlCode() { return this.data.vanity_url_code }

    // vanityUrlUses

    get verificationLevel() { return this.data.verification_level }
    // set

    verified: boolean

    voiceAdapterCreator: undefined | (() => undefined) // VoicaAdapter

    voiceStates: undefined // VoiceStateManager

    get widgetChannel() {
        //TODO
        return undefined
    }

    get widgetChannelId() { return undefined }
    // set

    get widgetEnabled() { return undefined }
    // set


    bannerURL(options?: Partial<StaticImageURLOptions>) {
        return this.banner ? `${DISCORD_IMAGE_BASE_URL}/banners/${this.id}/${this.banner}${parseStaticImageURLOptions(options)}` : null
    }

    async createTemplate(name: string, description?: string) {
        return null // GuildTemplate
    }

    async delete() {
        return this
    }

    discoverySplashURL(options?: Partial<StaticImageURLOptions>) {
        return this.discoverySplash ? `${DISCORD_IMAGE_BASE_URL}/discovery-splashes/${this.id}/${this.discoverySplash}${parseStaticImageURLOptions(options)}` : null
    }

    async edit(data: Partial<DiscordGuildEditData>) {
        return this
    }

    async editWelcomeScreen(data: Partial<{
        enabled: boolean
        description: string
        welcomeChannels: any[]
    }>) {
        return null // WelcomeScreen
    }

    async fetchAuditLogs(options: {} = {}) {
        return null // GuildAuditLogs
    }

    async fetchIntegrations() {
        return null // Map<string, Integration>
    }

    private ownerCache: any | undefined
    async fetchOwner() {
        return null // GuildMember
    }

    async fetchPreview() {
        return null // GuildPreview
    }

    async fetchTemplates() {
        return null // Map<string, GuildTemplate>
    }

    async fetchVanityData() {
        return null // Vanity
    }

    async fetchWebhooks() {
        return null // Map<string, Webhook>
    }

    async fetchWelcomeScreen() {
        return null // WelcomeScreen
    }

    async fetchWidget() {
        return null // Widget
    }

    async fetchWidgetSettings() {
        return null // GuildWidgetSettings
    }

    iconURL(options?: Partial<StaticImageURLOptions>) {
        return this.icon ? `${DISCORD_IMAGE_BASE_URL}/icons/${this.id}/${this.icon}${parseStaticImageURLOptions(options)}` : null
    }

    async leave() {
        return this
    }

    async setAFKChannel(channel: DiscordChannel<4> | string) {
        return this
    }

    async setBanner(banner: string) {
        return this
    }

    async setChannelPositions(positions: Array<{ channel: DiscordChannelBase | string, position?: number, parent?: DiscordChannel<4> | string, lockPermissions?: boolean }>) {
        return this
    }

    async setDefaultMessageNotifications(notifications: number) {
        return this
    }

    async setDiscoverySplash(splash: string) {
        return this
    }

    async setExplicitContentFilter(filter: string) {
        return this
    }

    async setIcon(icon: string) {
        return this
    }

    async setName(name: string) {
        return this
    }

    async setOwner(owner: any | string) {
        return this
    }

    async setPreferredLocale(locale: string) {
        return this
    }

    async setPublicUpdatesChannel(channel: DiscordChannel<0> | string) {
        return this
    }

    async setRolePositions(positions: Array<{ role: DiscordRole | string, position: number }>) {
        return this
    }

    async setRulesChannel(channel: DiscordChannel<0> | string) {
        return this
    }

    async setSplash(splash: string) {
        return this
    }

    async setSystemChannel(channel: DiscordChannel<0> | string) {
        return this
    }

    async setSystemChannelFlags(flags: number) {
        return this
    }

    async setVerificationLevel(level: number) {
        return this
    }

    async setWidgetSettings(settings: { enabled: boolean, channel: DiscordChannelBase | string | null }) {
        return this
    }

    async splashURL(options?: Partial<StaticImageURLOptions>) {
        return this.splash ? `${DISCORD_IMAGE_BASE_URL}/splashes/${this.id}/${this.splash}${parseStaticImageURLOptions(options)}` : null
    }

    toString() {
        return this.name
    }


    constructor(client: DiscordClient, data: DiscordGuildData) {
        this.client = client
        this.data = data
        
        this.id = data.id
        this.partnered = this.features.includes('PARTNERED')
        this.verified = this.features.includes('VERIFIED')

        this.channels = new DiscordChannelManager(this.client, this)
    }
}

export interface DiscordGuildData {
    default_message_notifications: number
    afk_channel_id: string | null
    public_updates_channel_id: string | null
    name: string
    region: string
    stickers: any[]
    banner: string | null
    description: string | null
    splash: string | null
    discovery_splash: string | null
    preferred_locale: string | null
    application_id: any | null
    channels: DiscordChannelBase[]
    mfa_level: number
    guild_scheduled_events: any[]
    icon: string | null
    large: boolean
    explicit_content_filter: number
    lazy: boolean
    joined_at: string
    system_channel_id: string | null
    premium_tier: number
    verification_level: number
    owner_id: string
    max_video_channel_users: number
    vanity_url_code: string | null
    threads: any[]
    member_count: number
    nsfw_level: number
    features: DiscordGuildFeature[]
    application_command_counts: any
    afk_timeout: number | null
    application_command_count: number
    id: string
    nsfw: boolean
    stage_instances: any[]
    rules_channel_id: string | null
    system_channel_flags: number
    max_members: number
    roles: DiscordRole[]
    premium_subscription_count: number
    guild_hashes: any
    emojis: any[]
}

type DiscordGuildFeature =
    | 'ANIMATED_ICON'
    | 'BANNER'
    | 'COMMERCE'
    | 'COMMUNITY'
    | 'DISCOVERABLE'
    | 'ENABLED_DISCOVERABLE_BEFORE'
    | 'FEATURABLE'
    | 'INVITE_SPLASH'
    | 'MEMBER_VERIFICATION_GATE_ENABLED'
    | 'MONETIZATION_ENABLED'
    | 'MORE_STICKERS'
    | 'NEWS'
    | 'NEW_THREAD_PERMISSIONS'
    | 'PARTNERED'
    | 'PREVIEW_ENABLED'
    | 'PRIVATE_THREADS'
    | 'ROLE_ICONS'
    | 'SEVEN_DAY_THREAD_ARCHIVE'
    | 'THREADS_ENABLED'
    | 'THREE_DAY_THREAD_ARCHIVE'
    | 'TICKETED_EVENTS_ENABLED'
    | 'VANITY_URL'
    | 'VERIFIED'
    | 'VIP_REGIONS'
    | 'WELCOME_SCREEN_ENABLED'

interface DiscordGuildEditData {
    name: string
    // TODO
}