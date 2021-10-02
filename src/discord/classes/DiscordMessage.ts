import { DiscordAttachment, DiscordChannel, DiscordEmbed, DiscordUserPartial } from "../discord-classes"
import { DiscordClient } from "../DiscordClient"
import { DiscordGuild } from "./DiscordGuild"
import { DiscordMember, DiscordMemberData } from "./DiscordMember"

export class DiscordMessage {
    readonly client: DiscordClient
    readonly data: DiscordMessageData

    get activity() { return null } // ?MessageActivity

    get applicationId() { return null } // string

    get attachments() { return this.data.attachments } // Map<string, MessageAttachment>

    get author() { return this.data.author }

    channel: undefined | DiscordChannel<0 | 13 | 12 | 6> // Text/DM/News/Thread

    get channelId() { return this.data.channel_id }

    get components() { return this.data.components }

    get content() { return this.data.content }

    get createdAt() { return DiscordClient.getCreatedAt(this) }

    crosspostable: undefined // boolean

    deletable: undefined // boolean

    deleted = false

    editable: undefined // boolean

    get editedTimestamp() { return this.data.edited_timestamp }

    get embeds() { return this.data.embeds }

    get flags() { return this.data.flags }

    get groupActivityApplication() { return null } // ?ClientApplication

    private _guild: DiscordGuild | null | undefined
    get guild() {
        if (this._guild !== undefined) return this._guild
        return this._guild = this.guildId ? this.client.getGuild(this.guildId) ?? null : null
    }

    get guildId() { return this.data.guild_id }

    get hasThread() { return null } // boolean

    readonly id: string

    get interaction() { return null } // MessageInteraction

    private _member: DiscordMember | null | undefined
    get member() {
        if (this._member !== undefined) return this._member
        if (this.data.member) this.data.member.user = this.data.author
        let member = this.guildId && this.data.member ? new DiscordMember(this.guild!, this.data.member) : null
        if (!member) member = this.guild?.members.resolve(this.author.id) ?? null
        return this._member = member
    }

    get mentions() { return this.data.mentions }

    get nonce() { return this.data.nonce }

    partial: undefined // boolean

    pinnable: undefined // boolean

    pinned: undefined // boolean

    reaction: undefined // ReactionManager

    reference: undefined // ?MessageReference

    stickers: undefined // Map<string, Sticker>

    get system() { return null } // boolean

    thread: undefined // ?ThreadChannel

    get tts() { return this.data.tts }

    get type() { return this.data.type }

    get url() { return `` }

    get webhookId() { return null } // ?string


    async awaitMessageComponent(/* AwaitMessageComponentOptions*/) {
        return null // MessageComponentInteraction
    }

    async awaitReactions(/*AwaitReactionsOptions*/) {
        return null // Map<string, MessageReaction>
    }

    async createMessageComponentCollector(/*MessageComponentCollectorOptions*/) {
        return null // InteractionCollector
    }

    async createReactionCollector(/*ReactionCollectorOptions*/) {
        return null // ReactionCollector
    }

    async crosspost() {
        return this
    }

    async delete() {
        return this
    }

    async edit(options: string /*| MessagePayload | MessageEditOptions*/) {
        return this
    }

    // fetch(- | -Reference | -Webhook)

    async pin() {
        return this
    }

    async react(emoji: string) {
        return this
    }

    async removeAttachments() {
        return this
    }

    async reply(message: string /*| MessagePayload | ReplyMessageOPtions*/) {
        return this // | Message[]
    }

    async startThread(/*StartThreadOptions*/) {
        return null // ThreadChannel
    }

    async suppressEmbeds(suppres: boolean = true) {
        return this
    }

    toString() {
        return this.content ?? ''
    }

    async unpin() {
        return this
    }


    constructor(client: DiscordClient, data: DiscordMessageData) {
        this.client = client
        this.data = data

        this.id = data.id
    }
}

export interface DiscordMessageData {
    type: number
    tts: boolean
    timestamp: string
    referenced_message: DiscordMessageData | null
    pinned: boolean
    mentions: (DiscordUserPartial & {
        member: DiscordMemberData
    })[]
    mention_roles: string[]
    mention_everyone: boolean
    member?: DiscordMemberData
    id: string
    flags: number
    embeds: DiscordEmbed[]
    edited_timestamp: any | null
    content: string | null
    components: any[]
    channel_id: string
    author: DiscordUserPartial
    attachments: DiscordAttachment[]
    guild_id: string | null
    nonce?: string
}