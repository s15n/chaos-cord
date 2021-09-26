import { Component, createRef, RefObject, UIEvent, UIEventHandler } from 'react'
import { currentClient } from '../App';
import { CallbackHandler, noCallback } from '../Callback'
import Button from '../components/Button';
import { DiscordChannel, DiscordChannelBase, DiscordMessageIn } from '../discord/discord-classes';
import { DiscordClient } from '../discord/DiscordClient';
import { dateToDateString } from '../utils';
import { isMemberListVisible } from './ChatContainer';
import ChatMessage from './ChatMessage';
import StorePage from './StorePage';

const messageHandler: CallbackHandler<DiscordMessageIn> = {
    callback: noCallback
}

export function pushMessage(message: DiscordMessageIn) {
    messageHandler.callback(message);
}

type ChatAreaProps = {
    channel?: DiscordChannelBase
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
            <main style={{
                display: 'flex',
                flexGrow: 1,
                flexDirection: 'column-reverse'
            }}>
                {this.props.channel?.type === 6 ? <StorePage channel={this.props.channel as DiscordChannel<6>}/> : <>
                <Input input={[this.state.input, (set) => this.setState({input: set})]} channel={this.props.channel}/>
                <Chat channel={this.props.channel}/></>}
            </main>
        )
    }
}

type ChatProps = {
    channel?: DiscordChannelBase
}

class Chat extends Component<ChatProps, {
    messages: DiscordMessageIn[]
}> {
    private currentChannel = this.props.channel

    private channelId = this.props.channel?.id
    private messages: DiscordMessageIn[] = []

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
            this.messages = messages.reverse()
            this.setState({
                messages: this.messages
            })
        })
    }

    pushMessage(message: DiscordMessageIn) {
        this.messages.push(message)
        return this.messages
    }

    private setCallback() {
        messageHandler.callback = (message) => {
            console.log(message.channel_id)
            console.log(this.props.channel?.id)
            console.log('#####')
            if (message.channel_id !== this.channelId) return

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
            this.messages.unshift(...messages.reverse())
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
            const time = new Date(message.timestamp)
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
            <div style={{
                height: '100%',
                width: '100%',
            }}>
                <div 
                style={{
                    //height: 'calc(100% - 138px)', // 100% - 60px - 48px - 8px - 22px
                    //width: `calc(100% - ${isMemberListVisible() ? 557 : 317}px`, // 100% - 240px - 240px? - 72px - 5px
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column-reverse',
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    position: 'fixed',
                    left: 312,
                    right: isMemberListVisible() ? 248 : 8,
                    top: 70,
                    bottom: 68
                }}
                ref={this.scrollArea}
                onScroll={this.onScroll}
                >
                    <div style={{
                        height: 24,
                        color: '#ffffff00'
                    }}>&nbsp;</div>
                    {arr}
                </div>
            </div>
        )
    }
}

const ChatMessageDivider = ({date}: {date: Date}) => (
    <div style={{
        width: '100%',
        height: 1,
        marginLeft: 16,
        marginRight: 14,
        marginTop: 24,
        marginBottom: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        display: 'inherit',
        justifyContent: 'center'
    }}>
        <span style={{
            marginTop: -11,
            height: 13,
            //alignSelf: "center",
            paddingLeft: 4,
            paddingRight: 4,
            paddingTop: 2,
            paddingBottom: 2,
            fontSize: '12px',
            fontWeight: 600,
            color: '#777777',
            backgroundColor: '#272727'
        }}>
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
        DiscordClient.request('POST', ['channels', this.props.channel?.id ?? 'null', 'message'], {
            content: text
        })
    }

    render() {
        return (
            <form style={{
                height: 68,
                paddingLeft: 16,
                paddingRight: 16,
            }}>
                <div id='ChatInput' className='row' style={{
                    height: 44,
                    paddingLeft: 16,
                    marginBottom: 24,
                    borderRadius: '8px'
                }}>
                    <div style={{
                        width: 40,
                        height: '100%'
                    }}>
                        <div style={{
                           marginLeft: -16,
                           paddingLeft: 16,
                           paddingRight: 16,
                           paddingTop: 10,
                           paddingBottom: 10,
                           width: 56,
                           height: 44
                        }}>
                            <Button style={{
                                width: 24,
                                height: 24,
                                color: '#cccccc'
                            }} hoverStyle={{ color: '#dddddd' }} activeStyle={{ color: '#eeeeee' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.00098C6.486 2.00098 2 6.48698 2 12.001C2 17.515 6.486 22.001 12 22.001C17.514 22.001 22 17.515 22 12.001C22 6.48698 17.514 2.00098 12 2.00098ZM17 13.001H13V17.001H11V13.001H7V11.001H11V7.00098H13V11.001H17V13.001Z"></path></svg>
                            </Button>
                        </div>
                    </div>

                    <div style={{
                        paddingTop: 9,
                        paddingLeft: 10,
                        paddingRight: 10,
                        display: 'flex',
                        flexGrow: 1,
                    }}>
                        <textarea
                        ref={this.textAreaRef}
                        className='text input' 
                        style={{
                            backgroundColor: '#ffffff00',
                            borderWidth: 0,
                            resize: 'none',
                            height: 22,
                            width: '100%',
                            fontSize: 16,
                        }}
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
                        placeholder='Message #text'
                        autoFocus={true}
                        />
                    </div>

                    <EmojiButton/>
                </div>
            </form>
        )
    }
}

class EmojiButton extends Component<{}, {
    isHoverEmoji: boolean
    emojiIndex: number
}> {
    constructor(props: {}) {
        super(props)
        this.state = {
            isHoverEmoji: false,
            emojiIndex: 0x1f973
        }
    }

    render() {
        const isHoverEmoji = this.state.isHoverEmoji
        const emojiIndex = this.state.emojiIndex
        return (
            <div style={{
                width: 38,
                height: '100%',
                marginRight: 8
            }}>
                <div style={{
                    marginLeft: 4,
                    paddingLeft: 4 - (isHoverEmoji ? 1 : 0),
                    paddingTop: 11 - (isHoverEmoji ? 1 : 0)
                }}>
                    <Button onHover={over => {
                        const state: any = over ? { 
                            isHoverEmoji: true, 
                            emojiIndex: Math.floor(Math.random() * 0x37) + 0x1f600
                        } : { isHoverEmoji: false }
                        this.setState(state)
                    }}>
                        <img
                            style={{
                                filter: `grayscale(${isHoverEmoji ? 0 : 100}%)`,
                                width: 22 + (isHoverEmoji ? 2 : 0),
                                height: 22 + (isHoverEmoji ? 2 : 0),
                            }}
                            src={`https://abs-0.twimg.com/emoji/v2/svg/${emojiIndex.toString(16)}.svg`}
                            alt='emoji'
                        />
                    </Button>
                </div>
            </div>
        )
    }
}