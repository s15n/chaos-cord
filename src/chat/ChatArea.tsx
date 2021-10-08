import { Component, createRef, RefObject, UIEvent, UIEventHandler } from 'react'
import { currentClient } from '../App';
import { CallbackHandler, noCallback } from '../Callback'
import Button from '../components/Button';
import { DiscordChannel, DiscordChannelBase } from '../discord/discord-classes';
import { DiscordClient } from '../discord/DiscordClient';
import { dateToDateString } from '../utils';
import { isMemberListVisible } from './ChatContainer';
import ChatMessage from './ChatMessage';
import StorePage from './StorePage';

import './ChatArea.css'
import { DiscordMessage, DiscordMessageData } from '../discord/classes/DiscordMessage';
import { discordFormattedText } from '../discord/discord-message-formatting';

const messageHandler: CallbackHandler<DiscordMessage> = {
    callback: noCallback
}

export function pushMessage(message: DiscordMessage) {
    messageHandler.callback(message);
}

type ChatAreaProps = {
    guildId: string
    channel: DiscordChannelBase
}

export default class ChatArea extends Component<ChatAreaProps, {
    input: string
}> {
    constructor(props: ChatAreaProps) {
        super(props)
        this.state = {
            input: ''
        }
    }

    render() {
        //if (this.props.newChannel) console.log('New Channel sel.')
        return (
            <main id='chat-area'>
                {this.props.channel?.type === 6 ? <StorePage channel={this.props.channel as DiscordChannel<6>}/> : <>
                <Input input={[this.state.input, (set) => this.setState({input: set})]} channel={this.props.channel}/>
                <Chat guildId={this.props.guildId} channel={this.props.channel}/></>}
            </main>
        )
    }
}

type ChatProps = {
    guildId: string
    channel: DiscordChannelBase
}

class Chat extends Component<ChatProps, {
    messages: DiscordMessage[]
}> {
    private currentChannel = this.props.channel

    private channelId = this.props.channel?.id
    private messages: DiscordMessage[] = []

    private fetchPaused = false
    private prevScroll = {
        height: 0,
        top: 0
    }

    scrollArea: RefObject<HTMLDivElement>

    constructor(props: ChatProps) {
        super(props)
        this.scrollArea = createRef()
        this.state = {
            messages: []
        }
    }

    loadLatestMessages() {
        console.log(`Loading Messages: ${this.channelId}`)
        DiscordClient.request('GET', ['channels', this.channelId ?? 'null', 'messages'], undefined, undefined, ['limit=50']).then(value => 
            value.json()
        ).then(messages => {
            if (!Array.isArray(messages)) return
            this.messages = []
            for (let i = messages.length - 1; i >= 0; --i) {
                const m = messages[i]
                m["guild_id"] = this.props.guildId
                this.messages.push(new DiscordMessage(currentClient()!, m))
            }
            this.setState({
                messages: this.messages
            })
        })
    }

    pushMessage(message: DiscordMessage) {
        this.messages.push(message)
        return this.messages
    }

    private setCallback() {
        messageHandler.callback = (message) => {
            //console.log(message.channel_id)
            //console.log(this.props.channel?.id)
            //console.log('#####')
            if (message.channelId !== this.channelId) return

            this.setState({
                messages: this.pushMessage(message)
            })
        }
    }

    tryReloadMessages() {
        this.currentChannel = this.props.channel
        this.channelId = this.currentChannel?.id
        this.loadLatestMessages()
        this.fetchPaused = false
        const scrollArea = this.scrollArea.current
        if (!scrollArea) return
        scrollArea.scrollTop = 0
    }

    componentDidMount() {
        console.log('mount')
        this.setCallback()
        this.tryReloadMessages()
    }

    componentDidUpdate() {
        this.setCallback()
        const newChannel = this.props.channel?.id !== this.currentChannel?.id
        if (newChannel) {
            this.tryReloadMessages()
        }
    }

    componentWillUnmount() {
        messageHandler.callback = noCallback
    }

    fetchMessagesBefore(id: string) {
        //currentClient()?.rest?.api?.channels?.[this.channelId!]?.messages?.get({ before: id, limit: 50 })
        DiscordClient.request('GET', ['channels', this.channelId ?? 'null', 'messages'], undefined, undefined, [`before=${id}`, 'limit=50']).then(value => 
            value.json()
        ).then(messages => {
            if (!Array.isArray(messages)) return
            const newMessages: DiscordMessage[] = []
            for (let i = messages.length - 1; i >= 0; --i) {
                const m = messages[i]
                m["guild_id"] = this.props.guildId
                newMessages.push(new DiscordMessage(currentClient()!, m))
            }
            this.messages.unshift(...newMessages)
            this.setState({
                messages: this.messages
            })
        })
    }

    private onScroll: UIEventHandler<HTMLDivElement> = event => {
        const target = event.target as HTMLDivElement
        let onTop = target.scrollTop <= 25 + target.clientHeight - target.scrollHeight + 1
        if (this.prevScroll.height < target.scrollHeight) {
            target.scrollTop = this.prevScroll.top
            this.fetchPaused = false
            onTop = false
        }
        if (onTop) {
            if (!this.fetchPaused) {
                this.fetchPaused = true
                console.log('Fetching messages...')
                this.fetchMessagesBefore(this.messages[0].id)
            }
        }
        this.prevScroll = {
            height: target.scrollHeight,
            top: target.scrollTop
        }
    }

    render() {
        const size = this.state.messages.length
        const arr = Array(size)

        let prevUserId
        //let lastMessage
        let prevTime: any//: { day: string, timestamp: number } | undefined = undefined
        for (let i = 0; i < size; ++i) {
            const message = this.state.messages[i]
            /*if (!message.author) {
                console.log('No author:')
                console.log(message)
                continue
            }*/
            const userId = message.author.id
            let groupStart = userId !== prevUserId
            const time = new Date(message.createdAt)
            //const timeDiff = lastMessage ? new Date(message.timestamp).getTime() - new Date(lastMessage.timestamp).getTime() : undefined
            const day = `${time.getDate()}.${time.getMonth()}.${time.getFullYear()}`
            const separator = day !== prevTime?.day
            if (separator) {
                groupStart = true
                arr.unshift(<ChatMessageDivider date={time}/>)
            }
            if (!groupStart) {
                if (prevTime && (time.getTime() - prevTime.timestamp) > 600000) groupStart = true
            }
            arr.unshift(<ChatMessage
            key={i}
            message={message}
            groupStart={groupStart}
            />)
            prevUserId = userId
            prevTime = {
                day: day,
                timestamp: time.getTime()
            }
        }

        return (
            <div id='chat'>
                <div className={isMemberListVisible() ? 'with-member-list-visible' : undefined}
                ref={this.scrollArea}
                onScroll={this.onScroll}
                >
                    {arr}
                </div>
            </div>
        )
    }
}

const ChatMessageDivider = ({date}: {date: Date}) => (
    <div className='chat-message-divider'>
        <span>
            {dateToDateString(date)}
        </span>
    </div>
)

type InputProps = {
    input: [string, (set: string) => void]
    channel: DiscordChannelBase | undefined
}

class Input extends Component<InputProps, {
    input: string
    activitiesShown: boolean
}> {
    textAreaRef: RefObject<HTMLTextAreaElement>

    activities: any[] = []

    constructor(props: InputProps) {
        super(props)
        this.state = {
            input: props.input[0],
            activitiesShown: false
        }
        this.textAreaRef = createRef()
    }

    submit(text: string) {
        DiscordClient.request('POST', ['channels', this.props.channel?.id ?? 'null', 'messages'], {
            content: text
        })
    }

    render() {
        return (
            <form id="chat-input">
                <div className='row'>
                    <button>
                        <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.00098C6.486 2.00098 2 6.48698 2 12.001C2 17.515 6.486 22.001 12 22.001C17.514 22.001 22 17.515 22 12.001C22 6.48698 17.514 2.00098 12 2.00098ZM17 13.001H13V17.001H11V13.001H7V11.001H11V7.00098H13V11.001H17V13.001Z"></path></svg>
                    </button>

                    <div id="chat-message-input">
                        <textarea
                        ref={this.textAreaRef}
                        onKeyPress={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                
                                const ref = this.textAreaRef.current!
                                if (!ref.textContent) return

                                this.setState({input: ''})
                                console.log(ref.textContent)

                                this.submit(ref.textContent)
                            }
                        }}
                        onInput={e => {
                            console.log(e)
                        }}
                        onChange={e => {
                            this.setState({input: e.target.value})
                            //e.target.
                        }}
                        value={this.state.input}
                        placeholder="Message #text"
                        autoFocus
                        spellCheck
                        >
                        </textarea>
                    </div>

                    <button onClick={e => {
                        e.preventDefault()

                        if (!this.state.activitiesShown) {
                        DiscordClient.request('GET', ['applications', 'public'], undefined, undefined, ['application_ids=755827207812677713', 'application_ids=832012774040141894', 'application_ids=878067389634314250', 'application_ids=879863686565621790', 'application_ids=879863976006127627', 'application_ids=880218394199220334'])
                        .then(value => value.json())
                        .then(apps => {
                            if (!Array.isArray(apps)) return
                            this.activities = []
                            apps.forEach(a => {
                                this.activities.push(
                                    <button style={{
                                        height: 40,
                                        marginTop: 10,
                                        width: 220,
                                        marginLeft: 10,
                                        paddingLeft: 0,
                                        display: 'block'
                                    }} onClick={() => {
                                        DiscordClient.request('POST', ['channels', this.textAreaRef.current?.value ?? 'null', 'invites'], {
                                            max_age: 0,
                                            target_type: 2,
                                            target_application_id: a.id
                                        })
                                        .then(invite => invite.json())
                                        .then(invite => {
                                            this.submit(`https://discord.gg/${invite.code}`)
                                            this.setState({ activitiesShown: false })
                                        })
                                    }}>
                                        <img
                                        src={`https://cdn.discordapp.com/app-icons/${a.id}/${a.icon}.webp?size=40&keep_aspect_ratio=false`}
                                        alt={a.name}
                                        style={{
                                            float: 'left',
                                            borderRadius: 4
                                        }}
                                        />
                                        <div style={{
                                            fontSize: 16,
                                            fontWeight: 500,
                                            paddingTop: 8,
                                            float: 'left',
                                            marginLeft: 10
                                        }}>
                                        {a.name}
                                        </div>
                                    </button>
                                )
                            })
                            this.setState({ activitiesShown: true })
                        })} else {
                            this.setState({ activitiesShown: false })
                        }
                    }}>
                        <div hidden={!this.state.activitiesShown} style={{
                            position: 'absolute',
                            marginTop: -328,
                            marginLeft: -130,
                            zIndex: 1000,
                            backgroundColor: '#202020',
                            paddingBottom: 10,
                            borderRadius: 4,
                        }}>
                            {this.activities}
                        </div>
                        <svg width="24" height="24" viewBox="0 0 20 24"><g clip-path="url(#856f591c-ce22-4d14-9655-f75d44068523)"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.92871 13.4149L10.5857 19.0709L18.3639 11.2927C19.7781 9.87859 22.6066 6.48376 21.1923 2.80748C17.5153 1.3932 14.1213 4.22173 12.7074 5.63625L4.92871 13.4149ZM16.064 9.93309C17.1686 9.93309 18.064 9.03766 18.064 7.93309C18.064 6.82852 17.1686 5.93309 16.064 5.93309C14.9594 5.93309 14.064 6.82852 14.064 7.93309C14.064 9.03766 14.9594 9.93309 16.064 9.93309Z" fill="currentColor"></path><path d="M3.41357 16.7844C2.34946 17.8496 2.00004 22 2.00004 22C2.00004 22 6.15125 21.6521 7.21627 20.5869C7.71243 20.0915 7.96638 19.4494 8 18.8004L5.21285 18.7866L5.19829 16C4.54947 16.0336 3.90973 16.2881 3.41357 16.7844Z" fill="currentColor"></path><path d="M9.17144 9.17151H3.51459L1.74684 10.9393L6.34302 11.9999L9.17144 9.17151Z" fill="currentColor"></path><path d="M14.8283 14.8283V20.4852L13.0606 22.2529L11.9999 17.6568L14.8283 14.8283Z" fill="currentColor"></path></g><defs><clipPath id="856f591c-ce22-4d14-9655-f75d44068523"><rect width="24" height="24"></rect></clipPath></defs></svg>
                    </button>

                    <button>
                        <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M5 3C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5ZM16.8995 8.41419L15.4853 6.99998L7 15.4853L8.41421 16.8995L16.8995 8.41419Z"></path></svg>
                    </button>

                    <EmojiButton/>
                </div>
            </form>
        )
    }
}

class EmojiButton extends Component<{}, {
    emojiIndex: number
}> {
    constructor(props: {}) {
        super(props)
        this.state = {
            emojiIndex: 0x1f973
        }
    }

    render() {
        const emojiIndex = this.state.emojiIndex
        return (
            <button
            className="emoji-button"
            onMouseEnter={() => {
                this.setState({
                    emojiIndex: Math.floor(Math.random() * 0x37) + 0x1f600
                })
            }}
            >
                <img
                src={`https://abs-0.twimg.com/emoji/v2/svg/${emojiIndex.toString(16)}.svg`}
                alt='emoji'
                />
            </button>
        )
    }
}