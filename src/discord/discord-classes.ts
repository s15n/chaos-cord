//#region Socket
export type DiscordEventType = 'READY' | 'MESSAGE_CREATE'

export interface DiscordSocketPayload<D extends DiscordData> {
    op: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
    d: D
}

interface DiscordData {}

export interface DiscordIdentify extends DiscordData {
    capabilities: number
    client_state?: {
        guild_hashes: {}
        highest_last_message_id: '0'
        read_state_version: 0
        user_guild_settings_version: 1
    }
    compress?: boolean
    presence?: {
        activities: []
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

export interface DiscordResume extends DiscordData {
    token: string
    session_id: string
    seq: number
}

type Os = 'Windows'
type Browser = 'Chrome'
//#endregion

export type DiscordStatus = 'online' | 'idle' | 'dnd' | 'invisible' | 'offline'

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
    member: DiscordMemberPartial
    id: string
    flags: number
    embeds: DiscordEmbed[]
    edited_timestamp: any | null
    content: string | null
    components: any[]
    channel_id: string
    author: DiscordUserPartial
    attachments: any[]
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

}

export interface DiscordUserPartial {
    username: string
    public_flags: number
    id: string
    discriminator: string
    avatar: string | null
}