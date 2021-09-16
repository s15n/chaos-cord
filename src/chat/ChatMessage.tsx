import { Component } from "react"
import { emojiSubst } from "../discord/discord-utils"

const ChatMessage = ({text, groupStart, author, time}: {
    text: string, 
    groupStart: boolean, 
    author?: ChatMessageAuthor, 
    time?: number
}) => (
    groupStart ? <ChatMessageGroupStart text={text} author={author!} time={time!}/> : <ChatMessageItem text={text}/>
)

const ChatMessageItem = ({text}: {text: string}) => (
    <div style={{
        width: 623, 
        height: 26, 
        paddingLeft: 72, 
        paddingRight: 48, 
        paddingTop: 2,
        paddingBottom: 2
    }}>
        <ChatMessageContent text={text}/>
    </div>
)

type ChatMessageAuthor = {
    name: string,
    image: string
}

const ChatMessageGroupStart = ({text, author, time}: {text: string, author: ChatMessageAuthor, time: number}) => (
    <div style={{
        width: 623, 
        height: 48, 
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
            }}>{/*dateToTimestampString(new Date(time))*/'01/01/01'}</span>
        </h2>
        <ChatMessageContent text={text}/>
    </div>
)

const messageRegex = /(?<emoji>\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])|(?<emoji_name>:\w+:|:[+-]1:)|(?<custom_emoji><:\w+:\d+>)/g

const ChatMessageContent = ({text}: {text: string}) => {
    const result = [];
    let prevI = 0;
    const matches = text.matchAll(messageRegex)
    while (true) {
        const next = matches.next()
        if (next.done) break
        const match = next.value

        //console.log(match.groups);
        const i = match.index
        if (i === undefined) continue

        if (prevI != i) {
            result.push(text.substring(prevI, i))
        }
        let length = 0

        const groups = match.groups
        if (groups?.emoji) {
            const id = text.codePointAt(i)
            if (id === undefined) continue
            result.push(<Emoji id={id.toString(16)}/>)
            length = groups.emoji.length
        } else if (groups?.emoji_name) {
            const subst = emojiSubst[groups.emoji_name.slice(1, -1)]
            if (subst) {
                result.push(<Emoji id={subst}/>)
                length = groups.emoji_name.length
            }
        } else if (groups?.custom_emoji) {
            result.push(<Emoji url={`https://cdn.discordapp.com/emojis/${(groups.custom_emoji.split(':')[2].slice(0, -1))}.png`}/>)
            length = groups.custom_emoji.length
        }

        prevI = i + length
    }
    const rem = text.substring(prevI)
    if (rem.length > 0) {
        result.push(rem)
    }
    return (
        <span className='text message-text'>{result}</span>
    );
}

const Emoji = ({url, id}: { url: string, id?: never } | { id: string, url?: never }) => (
    <img src={url ?? `https://abs-0.twimg.com/emoji/v2/svg/${id}.svg`} alt='E' style={{
        width: 22,
        height: 22,
        marginBottom: -5,
        marginLeft: 1,
        marginRight: 3
    }}>
    </img>
)

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

export default ChatMessage