import { Component, createRef } from 'react'
import { CallbackHandler, noCallback } from '../Callback'
import Button from '../components/Button';
import { DiscordMessageIn } from '../discord/discord-classes';
import { isMemberListVisible } from './ChatContainer';
import ChatMessage from './ChatMessage';

const messageHandler: CallbackHandler<any> = {
    callback: noCallback
}

export function pushMessage(message: any) {
    console.log('pushing message -')
    messageHandler.callback(message);
}

export default class ChatArea extends Component<{}, {
    input: string
}> {
    constructor(props: {}) {
        super(props)
        this.state = {
            input: ''
        }
    }

    render() {
        return (
            <main style={{
                display: 'flex',
                flexGrow: 1,
                flexDirection: 'column-reverse'
            }}>
                <Input input={[this.state.input, (set) => this.setState({input: set})]}/>
                <Chat/>
            </main>
        )
    }
}

class Chat extends Component<{}, {
    messages: DiscordMessageIn[]
}> {
    _messages: DiscordMessageIn[] = []

    constructor(props: {messages: DiscordMessageIn[]}) {
        super(props)
        this.state = {
            messages: []
        }
        fetch('https://discord.com/api/v9/channels/581185346465824770/messages?limit=50', {
            headers: {
                'Authorization': 'ODg3MzM4OTU4NDUzODY2NTU3.YUCs2A.XZz40Vz7W5foc3vYrrhG0Zhs6ts'
            }
        }).then(value => 
            value.json()
        ).then(messages => {
            this._messages = messages.reverse()
            this.setState({
                messages: this._messages
            })
        })
    }

    pushMessage(message: DiscordMessageIn) {
        this._messages.push(message)
        return this._messages
    }

    componentDidMount() {
        console.log('mount')
        messageHandler.callback = (message) => {
            console.log('pushing message')
            this.setState({
                messages: this.pushMessage(message)
            })
        }
    }

    componentWillUnmount() {
        messageHandler.callback = noCallback
    }

    render() {
        const size = this.state.messages.length
        let arr = Array(size)

        let prevUserId
        for (let i = 0; i < size; ++i) {
            const message = this.state.messages[i]
            const userId = message.author.id
            let groupStart = userId !== prevUserId
            if (!groupStart) {
                
            }
            arr[size - i - 1] = <ChatMessage 
            message={message}
            groupStart={groupStart}
            />
            prevUserId = userId;
        }

        return (
            <div style={{
                height: '100%',
                width: '100%',
            }}>
                <div style={{
                    height: 'calc(100% - 116px)', // 100% - 60px - 48px - 8px
                    width: `calc(100% - ${isMemberListVisible() ? 557 : 317}px`, // 100% - 240px - 240px? - 72px - 5px
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column-reverse',
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    position: 'fixed',
                }}>
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

type InputProps = {
    input: [string, (set: string) => void]
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
        fetch('https://discord.com/api/v9/channels/581185346465824770/messages', {
            method: 'POST',
            body: JSON.stringify({content: text}),
            headers: {
                'Authorization': 'ODg3MzM4OTU4NDUzODY2NTU3.YUCs2A.XZz40Vz7W5foc3vYrrhG0Zhs6ts',
                'Content-Type': 'application/json'
            }
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
                            }} baseColor='#cccccc' overColor='#dddddd' activeColor='#eeeeee'>
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