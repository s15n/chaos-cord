//#region Socket
export type OPOut = 2 | 6 | 8 | 14

export interface DiscordSocketPayload<OP extends OPOut, D extends DiscordData<OP>> {
    op: OP
    d: D
}

export interface DiscordData<OP extends OPOut> {}

export interface DiscordIdentify extends DiscordData<2> {
    capabilities: number
    client_state?: {
        guild_hashes: {}
        highest_last_message_id: '0'
        read_state_version: 0
        user_guild_settings_version: 1
    }
    compress?: boolean
    presence?: {
        activities: {}[]
        afk?: boolean
        since?: number
        status: DiscordStatus
    }
    properties: {
        os: Os
        browser: Browser
        device?: string
        system_locale?: string
        browser_user_agent?: string
        browser_version?: string
        os_version?: string
        referrer?: string
        referring_domain?: string,
        referrer_current?: string,
        referring_domain_current?: string,
        release_channel?: string,
        client_build_number?: number,
        client_event_source?: null
    }
}

export interface DiscordResume extends DiscordData<6> {
    token: string
    session_id: string
    seq: number
}

export interface DiscordRequestGuildMembers extends DiscordData<8> {
    guild_id: [string]
    user_ids: string[]
}

export interface DiscordIDK extends DiscordData<14> {
    guild_id: string
    channels: { [name: string]: [[0, 99]] }
    activities?: boolean
    threads?: boolean
    typing?: boolean
}

type Os = 'Windows'
type Browser = 'Chrome'
//#endregion

export type DiscordStatus = 'online' | 'idle' | 'dnd' | 'invisible' | 'offline'

export interface DiscordGuildData {
    default_message_notifications: number
    afk_channel_id: string | null
    public_updates_channel_id: string | null
    name: string
    region: string
    stickers: any[]
    banner: any | null
    description: string | null
    splash: any | null
    discovery_splash: any | null
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
    features: string[]
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

/*
"guild_hashes": {
    "version": 1,
    "roles": {
        "omitted": false,
        "hash": "AX47nlJn0qQ"
    },
    "metadata": {
        "omitted": false,
        "hash": "Tt2pjnCn/Ec"
    },
    "channels": {
        "omitted": false,
        "hash": "2VgDr4s2xMs"
    }
},
*/

type DiscordChannelType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 10 | 11 | 12 | 13

export interface DiscordChannel<T extends DiscordChannelType> {
    type: T
    topic: T extends 0 ? string | null : undefined
    rate_limit_per_user: T extends 0 ? number : undefined
    user_limit: T extends 2 ? number : undefined
    rtc_region: T extends 2 ? any | null : undefined
    position: number
    permission_overwrites: {
        type: number
        id: string
        deny: string
        allow: string
    }[]
    parent_id?: string
    name: string
    last_message_id: T extends 0 ? string | null : undefined
    id: string
    bitrate: T extends 1 ? number : undefined
}

export type DiscordChannelBase = DiscordChannel<DiscordChannelType>

export interface DiscordRole {
    tags?: any
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

interface DiscordEmoji {
    roles: any[]
    require_colons: boolean
    name: string
    managed: boolean
    id: string
    available: boolean
    animated: boolean
}

export interface DiscordMessage {

}

export interface DiscordMessageIn {
    type: number
    tts: boolean
    timestamp: string
    referenced_message: DiscordMessageIn | null
    pinned: boolean
    mentions: (DiscordUserPartial & {
        member: DiscordMemberPartial
    })[]
    mention_roles: string[]
    mention_everyone: boolean
    member?: DiscordMemberPartial
    id: string
    flags: number
    embeds: DiscordEmbed[]
    edited_timestamp: any | null
    content: string | null
    components: any[]
    channel_id: string
    author: DiscordUserPartial
    attachments: DiscordAttachment[]
    guild_id: string
}

export interface DiscordMemberPartial {
    roles: any[]
    nick: string | null
    mute: boolean
    joined_at: string
    hoisted_role: any | null
    deaf: boolean
    avatar: string | null
}

export interface DiscordMember extends DiscordMemberPartial {
    premium_since: any | null
    pending: boolean
    is_pending: boolean
}

export interface DiscordEmbed {
    title?: string
    type?: 'rich' | 'image' | 'video' | 'gifv' | 'article' | 'link'
    footer?: {
        text: string
        icon_url?: string
        icon_proxy_url?: string
    }
    fields?: DiscordEmbedField[]
    description?: string
    color?: number
    author?: {
        name: string
        icon_url?: string
        icon_proxy_url?: string
    }
    thumbnail?: {
        url: string
        width?: number
        height?: number
        proxy_url?: string
    }
    image?: {
        url: string
        width?: number
        height?: number
        proxy_url?: string
    }
    video?: {
        url: string
        width?: number
        height?: number
        proxy_url?: string
    }
    provider?: {
        name: string
        url?: string
    }
    url?: string
}

export interface DiscordEmbedField {
    value: string
    name: string
    inline: boolean
}

export interface DiscordAttachment {
    id: string
    filename: string
    content_type: string
    size: number
    url: string
    proxy_url?: string
    height?: number | null
    width?: number | null
    ephemeral?: boolean
}

export interface DiscordUserPartial {
    username: string
    public_flags?: number
    id: string
    discriminator: string
    avatar: string | null
    bot?: boolean
}