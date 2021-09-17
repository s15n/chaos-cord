import { DiscordMessageIn } from "../discord/discord-classes"
import ChatMessageContent from "../discord/discord-message-formatting"
import { dateToTimestampString } from "../utils"

const ChatMessage = ({message, groupStart}: {message: DiscordMessageIn, groupStart: boolean}) => (
    groupStart ? <ChatMessageGroupStart  message={message}/> : <ChatMessageItem  message={message}/>
)

const ChatMessageItem = ({message}: {message: DiscordMessageIn}) => (
    <div style={{
        width: 623,
        paddingLeft: 72, 
        paddingRight: 48, 
        paddingTop: 2,
        paddingBottom: 2
    }}>
        <ChatMessageContent message={message}/>
    </div>
)

const ChatMessageGroupStart = ({message}: {message: DiscordMessageIn}) => {
    const author = getAuthor(message)
    return (
        <div style={{
            width: 623,
            paddingLeft: 72, 
            paddingRight: 48,
            paddingTop: 2,
            paddingBottom: 2,
            marginTop: 17,
        }}>
            <img className='avatar' style={{
                width: 40,
                height: 40,
                marginTop: 2,
                marginLeft: -56,
            }} src={author.image} alt='avatar'/>
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
                }}>{author.name}</span>
                <span style={{
                    width: 'auto',
                    height: 'auto',
                    marginLeft: 4,
                    color: '#777777',
                    fontSize: '12px',
                }}>{dateToTimestampString(new Date(message.timestamp))}</span>
            </h2>
            <ChatMessageContent message={message}/>
        </div>
    )
}

const ChatMessageDivider = ({date}: {date: number}) => (
    <div style={{
        width: '100%',
        height: 0,
        marginLeft: 16,
        marginRight: 14,
        marginTop: 24,
        marginBottom: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.06)'
    }}>
        <span style={{
            marginTop: -11,
            height: 13,
            alignSelf: "center",
            paddingLeft: 4,
            paddingRight: 4,
            paddingTop: 2,
            paddingBottom: 2,
            fontSize: '12px',
            fontWeight: 600,
            color: '#777777',
            backgroundColor: '#272727'
        }}>
            {/*dateToDateString(date)*/'1 January 1970'}
        </span>
    </div>
)

function getAuthor(message: DiscordMessageIn) {
    const avatar = message.member?.avatar ?? message.author.avatar;
    const image = avatar ? `https://cdn.discordapp.com/avatars/${message.author.id}/${avatar}.webp?size=128` : `https://cdn.discordapp.com/embed/avatars/${Number.parseInt(message.author.discriminator) % 5}.png`
    return {
        image: image,
        name: (message.member?.nick ?? message.author.username) as string
    }
}

export default ChatMessage