import { currentClient } from "../App";
import { colorIntToCss } from "../utils";
import { DiscordMessageIn } from "./discord-classes";
import { DiscordClient } from "./DiscordClient";
import Embed from "./Embed";

const messageSpecialRegex = /(?<br>\n)|(?<a>https?:\/\/([\w-\/:%\d]+\.)*[\w-\/%\d]+)|(?<emoji_name>:\w+:|:[+-]1:)|(?<custom_emoji><a?:\w+:\d+>)|(?<mention><@[!&]?\d+>)|(?<channel><#\d+>)|(?<emoji>\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g
const markdownRegex = /(?<b>\*\*(?:[^*]|\*[^*])+\*?\*\*)|(?<i>\*[^*]+\*)|(?<u>__(?:[^_]|_[^_])+__)|(?<s>~~(?:[^~]|~[^~])+~~)|(?<c>`[^`\n]+`)/g
// |(?<q>(?<![^\n])>\s\w+\n?)

const ChatMessageContent = ({message}: {message: DiscordMessageIn}) => {
    const text = message.content?.trim()

    const textResult = text ? formattedText(text, message) : null
    const embedResult = message.embeds.map((embed, index) => <Embed key={index} embed={embed} messageRef={message}/>)
    const attachments: any[] = []
    message.attachments.forEach((att, index) => {
        console.log(att)
        if (att.content_type?.startsWith('image/'))
        attachments.push(
            <div key={index} style={{
                marginTop: 2,
                marginBottom: 2
            }}>
                <img src={att.url} alt={att.filename} style={{
                    maxWidth: 400,
                    maxHeight: 400,
                    borderRadius: 4
                }}/>
            </div>
        )
    })

    return (
        <div className='text message-text' style={{
            marginBottom: 3,
        }}>
            {textResult}
            {embedResult}
            {attachments.length > 0 ? attachments : null}
        </div>
    );
}

function formattedText(text: string, message: DiscordMessageIn): any[] {
    //console.log(`formatting ${text}`)
    const result = []

    let prevI = 0

    const mdMatches = text.matchAll(markdownRegex)
    while (true) {
        const next = mdMatches.next()
        if (next.done) break
        const match = next.value

        const i = match.index
        if (i === undefined) continue

        if (prevI !== i) {
            result.push(text.substring(prevI, i))
        }
        let length = 0

        const groups = match.groups
        if (groups) {
            if (groups.b) {
                const l = groups.b.length
                result.push(<b>{formattedText(text.substring(i + 2, i + l - 2), message)}</b>)
                length = l
            } else if (groups.i) {
                const l = groups.i.length
                result.push(<i>{formattedText(text.substring(i + 1, i + l - 1), message)}</i>)
                length = l
            } else if (groups.u) {
                const l = groups.u.length
                result.push(<u>{formattedText(text.substring(i + 2, i + l - 2), message)}</u>)
                length = l
            } else if (groups.s) {
                const l = groups.s.length
                result.push(<s>{formattedText(text.substring(i + 2, i + l - 2), message)}</s>)
                length = l
            } else if (groups.c) {
                const l = groups.c.length
                result.push(<code>{formattedText(text.substring(i + 1, i + l - 1), message)}</code>)
                length = l
            } else if (groups.q) {
                const l = groups.q.length
                result.push(
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <div style={{width: 4, height: 22, backgroundColor: '#777777', borderRadius: 4}}/>
                        <blockquote>{formattedText(text.substring(i + 2, i + l), message)}</blockquote>
                    </div>
                )
                length = groups.q.endsWith('\n') ? l + 1 : l
            }
        }
        
        prevI = i + length
    }

    const mdI = prevI
    prevI = 0

    const matches = text.matchAll(messageSpecialRegex)
    while (true) {
        const next = matches.next()
        if (next.done) break
        const match = next.value

        //console.log(match.groups);
        const i = match.index
        if (i === undefined || i < mdI) continue

        if (prevI !== i) {
            result.push(text.substring(prevI, i))
        }
        let length = 0

        const groups = match.groups
        if (groups) {
            if (groups.br) {
                result.push(<br/>)
                length = 1
            } else if (groups.a) {
                const l = groups.a.length
                const href = text.substring(i, i + l)
                result.push(<a href={href} target='_blank'>{href}</a>)
                length = l
            } else if (groups.emoji) {
                const id = text.codePointAt(i)
                if (id === undefined) continue
                result.push(<Emoji id={id.toString(16)}/>)
                length = groups.emoji.length
            } else if (groups.emoji_name) {
                const subst = emojiSubst[groups.emoji_name.slice(1, -1)]
                if (subst) {
                    result.push(<Emoji id={subst}/>)
                    length = groups.emoji_name.length
                }
            } else if (groups.custom_emoji) {
                const emoji = groups.custom_emoji
                const animated = emoji[1] === 'a'
                result.push(<Emoji url={`https://cdn.discordapp.com/emojis/${emoji.split(':')[2].slice(0, -1)}.${animated ? 'gif' : 'png'}`}/>)
                length = groups.custom_emoji.length
            } else if (groups.mention) {
                const mention = groups.mention
                const type = mention[2] === '!' ? 'nick' : mention[2] === '&' ? 'role' : 'user'
                const id = mention.slice(type !== 'user' ? 3 : 2, -1)
                const target: any = type === 'role' ? (message.mention_roles.includes(id) ? DiscordClient.getRole(currentClient()?.getGuild(message.guild_id), id) : undefined) : message.mentions.find(m => m.id === id)
                if (target) {
                    result.push(<Mention before='@' text={
                        type === 'role' 
                        ? target?.name
                        : (type === 'nick' ? target.member?.nick : undefined) ?? target.username
                    } color={type === 'role' && target ? colorIntToCss(target.color) : undefined}/>)
                    length = mention.length
                }
            } else if (groups.channel) {
                const id = groups.channel.slice(2, -1)
                const text = id//getGuilds()?.[0].channels.find((c: any) => c.id === id).name
                result.push(<Mention before={<svg width="18" height="18" viewBox="0 0 24 16"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"></path></svg>}
                text={text}/>)
                length = groups.channel.length
            }
        }

        prevI = i + length
    }
    if (prevI >= mdI) {
        const rem = text.substring(prevI)
        if (rem.length > 0) {
            result.push(rem)
        }
    }

    return result
}

export { formattedText as discordFormattedText }

const Emoji = ({url, id}: { url: string, id?: never } | { id: string, url?: never }) => (
    <img src={url ?? `https://abs-0.twimg.com/emoji/v2/svg/${id}.svg`} alt=" " style={{
        width: '1.3em',
        height: '1.3em',
        marginBottom: -5,
        marginLeft: 1,
        marginRight: 1
    }}>
    </img>
)

const Mention = ({before, text, color}: {before: any, text: string, color?: string}) => (
    <span style={{
        paddingLeft: 2,
        paddingRight: 2,
        backgroundColor: 'rgba(88, 101, 242, 0.3)',
        borderRadius: 3,
        color: color
    }}>
        {before}
        <b>{text}</b>
    </span>
)

export default ChatMessageContent

const emojiSubst: any = {
    '+1': '1f44d',
    'scroll': '1f4dc'
}