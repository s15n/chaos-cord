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
}> {
    textAreaRef: any

    constructor(props: InputProps) {
        super(props)
        this.state = {
            input: props.input[0]
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
                                
                                const ref: HTMLTextAreaElement = this.textAreaRef.current
                                if (!ref.textContent) return

                                this.setState({input: ''})
                                console.log(ref.textContent)

                                this.submit(ref.textContent)
                            }
                        }}
                        onChange={e => {
                            this.setState({input: e.target.value})
                        }}
                        value={this.state.input}
                        placeholder="Message #text"
                        autoFocus
                        spellCheck
                        />
                    </div>

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