import { useState } from "react"
import { DiscordMessage } from "../discord/classes/DiscordMessage"
import ChatMessageContent from "../discord/discord-message-formatting"
import { dateToTimestampString } from "../utils"

const ChatMessage = ({message, groupStart}: {message: DiscordMessage, groupStart: boolean}) => {
    switch (message.type) {
    case 7: return (
        <div className="text" style={{
            width: 623,
            paddingLeft: 72, 
            paddingRight: 48,
            paddingTop: 2,
            paddingBottom: 2,
            marginTop: 17,
        }}>Welcome {message.member?.nickname ?? message.author.username}</div>
    )
    case 8: return (
        <div className="text" style={{
            width: 623,
            paddingLeft: 72, 
            paddingRight: 48,
            paddingTop: 2,
            paddingBottom: 2,
            marginTop: 17,
        }}>{message.member?.nickname ?? message.author.username} has boosted the server!</div>
    )
    }
    return groupStart ? <ChatMessageGroupStart  message={message}/> : <ChatMessageItem  message={message}/>
}

const ChatMessageItem = ({message}: {message: DiscordMessage}) => {
    const [hover, setHover] = useState(false)
    return (
        <div
        style={{
            width: 623,
            paddingLeft: 72, 
            paddingRight: 48, 
            paddingTop: 2,
            paddingBottom: 2,
            backgroundColor: hover ? '#11111133' : undefined
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        >
            <ChatMessageContent message={message}/>
        </div>
    )
}

const ChatMessageGroupStart = ({message}: {message: DiscordMessage}) => {
    //const author = getAuthor(message)
    const avatar = message.member?.displayAvatar ?? message.author.avatar;
    const authorImage = avatar ? `https://cdn.discordapp.com/avatars/${message.author.id}/${avatar}.webp?size=128` : `https://cdn.discordapp.com/embed/avatars/${Number.parseInt(message.author.discriminator) % 5}.png`
    //const authorImage = message.member?.displayAvatarURL({ format: 'webp', size: 128 })
    const authorName = message.member?.nickname ?? message.author.username
    const isAuthorBot = message.author.bot === true
    const authorFlags = message.author.public_flags ?? 0

    const [hover, setHover] = useState(false)
    return (
        <div style={{
            paddingLeft: 72, 
            paddingRight: 48,
            paddingTop: 2,
            paddingBottom: 2,
            marginTop: 17,
            backgroundColor: hover ? '#11111133' : undefined
        }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <img className='avatar' style={{
                width: 40,
                height: 40,
                marginTop: 2,
                marginLeft: -56,
            }} src={authorImage} alt='avatar'/>
            <h2 style={{
                width: '100%',
                height: 22,
                fontSize: 16,
                marginTop: 0,
                marginBottom: 0
            }}>
                <span style={{
                    width: 'auto',
                    height: 'auto',
                    marginRight: 4,
                    color: (message.member?.displayColor ? `#${message.member.displayColor.toString(16)}` : undefined) ?? '#7f7f7f'
                }}>{authorName}</span>
                {isAuthorBot ? <span style={{
                    borderRadius: 3,
                    backgroundColor: '#4e5d94',
                    fontSize: 10,
                    fontWeight: 500,
                    padding: '1px 5px',
                }}>
                    {authorFlags & 1 << 16 
                    ? <svg style={{ marginBottom: -4, marginLeft: -4 }} aria-label="Verified bot" width="16" height="16" viewBox="0 0 16 15.2"><path d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z" fill="currentColor"></path></svg>
                    : null}
                    BOT
                </span> : null}
                <span style={{
                    width: 'auto',
                    height: 'auto',
                    marginLeft: 4,
                    color: '#777777',
                    fontSize: '12px',
                }}>{dateToTimestampString(new Date(message.createdAt))}</span>
            </h2>
            <ChatMessageContent message={message}/>
        </div>
    )
}

/*function getAuthor(message: DiscordMessage) {
    const avatar = message.member?.avatar ?? message.author.avatar;
    const image = avatar ? `https://cdn.discordapp.com/avatars/${message.author.id}/${avatar}.webp?size=128` : `https://cdn.discordapp.com/embed/avatars/${Number.parseInt(message.author.discriminator) % 5}.png`
    return {
        image: image,
        name: (message.member?.nick ?? message.author.username) as string,
        bot: message.author.bot === true,
        flags: message.author.public_flags ?? 0
    }
}*/

export default ChatMessage