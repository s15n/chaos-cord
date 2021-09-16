import { Component, createRef } from 'react'
import { CallbackHandler, noCallback } from '../Callback'
import Button from '../components/Button';
import TextInput from '../components/TextInput';

const messageHandler: CallbackHandler<string> = {
    callback: noCallback
}

export function pushMessage(message: string) {
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
    messages: string[]
}> {
    _messages: string[] = []

    constructor(props: {messages: string[]}) {
        super(props)
        this.state = {
            messages: []
        }
    }

    pushMessage(message: string) {
        this._messages.push(message)
        return this._messages
    }

    componentDidMount() {
        messageHandler.callback = (message) => {
            this.setState({
                messages: this.pushMessage(message)
            })
        }
    }

    componentWillUnmount() {
        messageHandler.callback = noCallback
    }

    render() {
        return (
            <div>
                Chat
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

    render() {
        return (
            <form style={{
                height: 68,
                paddingLeft: 16,
                paddingRight: 16,
                marginTop: -8,
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
                            }} baseColor='#cccccc'>
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
                                const ref: HTMLTextAreaElement = this.textAreaRef.current
                                this.setState({input: ''})
                                console.log(ref.textContent)
                                e.preventDefault()
                            }
                        }}
                        onChange={e => {
                            this.setState({input: e.target.value})
                        }}
                        value={this.state.input}
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


/*
class Chat extends Component {
    _messages = [];

    _pushMessage(message) {
        this._messages.push(message);
        return this._messages;
    }

    constructor(props) {
        super(props);
        this.state = {
            messages: []
        }
        axios.get('https://discord.com/api/v9/channels/581185346465824770/messages?limit=50', {
           headers: {
               'Authorization': 'ODg3MzM4OTU4NDUzODY2NTU3.YUCs2A.XZz40Vz7W5foc3vYrrhG0Zhs6ts'
           }
        }).then((value) => {
            //console.log(value.data);
            const messages = value.data.reverse();
            this._messages = messages;
            this.setState({
                messages: this._messages
            })
        })
    }
    
    componentDidMount() {
        messageHandler.callback = (message) => {
            this.setState({
                messages: this._pushMessage(message)
            });
        }
    }

    componentWillUnmount() {
        messageHandler.callback = () => {};
    }

    render() {
        return (
            <View style={[universalStyle.container, {
                height: windowSize.height - 60 - 48,
                paddingBottom: 32,
            }]}>
                <SectionList
                scrollsToTop={false}
                inverted={true}
                sections={(() => {
                    const size = this.state.messages.length;
                    let arr = Array(size);
                    let prevUserId;
                    for (let i = 0; i < size; ++i) {
                        const message = this.state.messages[i];
                        const userId = message.author.id;
                        let groupStart = userId !== prevUserId;
                        if (!groupStart) {
                            
                        }
                        arr[size - i - 1] = {
                            value: message.content,
                            groupStart: groupStart,
                            author: groupStart ? authorImage(message, userId) : undefined,
                            time: groupStart ? Date.parse(message.timestamp) : undefined,
                        };
                        prevUserId = userId;
                    }
                    return [
                        { data: arr }
                    ];
                })()}
                renderItem={({item}) => <ChatMessage groupStart={item.groupStart} text={item.value} author={item.author}/>}
                renderSectionFooter={() => <ChatMessageDivider date={new Date()}/>}
                stickySectionHeadersEnabled={false}
                />
            </View>
        );
    }
}
*/
/*
const Input = ({inputDelegate: [currentInput, setCurrentInput]}) => {
    let textInput = null;

    function submit() {
        if (currentInput.length === 0) return;
        const text = currentInput;
        //messages.push(currentInput);
        setCurrentInput("");
        textInput?.clear();

        axios.post('https://discord.com/api/v9/channels/581185346465824770/messages', {
            content: text
        }, {
            headers: {
                'Authorization': 'ODg3MzM4OTU4NDUzODY2NTU3.YUCs2A.XZz40Vz7W5foc3vYrrhG0Zhs6ts',
                'Content-Type': 'application/json'
            }
        })
    }

    return (
        <View style={{
            height: 68,
            paddingHorizontal: 16,
            marginTop: -8,
        }}>
            <View style={{
                height: 44,
                paddingLeft: 16,
                marginBottom: 24,
                flexDirection: "row",
                backgroundColor: colors.input,
                borderRadius: '8px'
            }}>
                <View style={{
                    width: 40,
                    height: '100%'
                }}>
                    <View style={{
                       marginLeft: -16,
                       paddingHorizontal: 16,
                       paddingVertical: 10,
                       width: 56,
                       height: 44
                    }}>
                        <TouchableOpacity style={{
                            width: 24,
                            height: 24,
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24"><path fill={colors.button} d="M12 2.00098C6.486 2.00098 2 6.48698 2 12.001C2 17.515 6.486 22.001 12 22.001C17.514 22.001 22 17.515 22 12.001C22 6.48698 17.514 2.00098 12 2.00098ZM17 13.001H13V17.001H11V13.001H7V11.001H11V7.00098H13V11.001H17V13.001Z"></path></svg>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{
                    paddingTop: 11,
                    paddingHorizontal: 10,
                    flexGrow: 1,
                }}>
                    <TextInput
                    style={[universalStyle.text, {
                        height: 22,
                        width: '100%',
                        fontSize: 16,
                    }]}
                    autoFocus={true}
                    ref={(input) => { textInput = input }}
                    placeholder='Message #text'
                    onChangeText={setCurrentInput}
                    onSubmitEditing={submit}
                    blurOnSubmit={false}
                    />
                </View>
                

                <EmojiButton/>
            </View>
        </View>
    );
}*/

/*const EmojiButton = () => {
    const [isHoverEmoji, setHoverEmoji] = useState(false);
    let [emojiIndex, setEmojiIndex] = useState(0x1f973);

    return (
        <View style={{
            width: 38,
            height: '100%',
            marginRight: 8
        }}>
            <View style={{
                marginHorizontal: 4,
                paddingHorizontal: 4 - (isHoverEmoji ? 1 : 0),
                paddingVertical: 11 - (isHoverEmoji ? 1 : 0)
            }}>
                <TouchableOpacity style={{
                    //width: 22,
                    //height: 22,
                }}>
                    <Image
                        style={{
                            filter: `grayscale(${isHoverEmoji ? 0 : 100}%)`,
                            width: 22 + (isHoverEmoji ? 2 : 0),
                            height: 22 + (isHoverEmoji ? 2 : 0),
                        }}
                        source={{
                            uri: `https://abs-0.twimg.com/emoji/v2/svg/${emojiIndex.toString(16)}.svg`,
                        }}
                    />
                </TouchableOpacity>
                <div style={{
                    position: "absolute",
                    cursor: "pointer",
                    width: 22,
                    height: 22
                }} onMouseEnter={() => {
                    setHoverEmoji(true);
                    setEmojiIndex(Math.floor(Math.random() * 0x37) + 0x1f600);
                }} onMouseLeave={() => setHoverEmoji(false)}/>
            </View>
        </View>
    );
}

function authorImage(message, userId=message.author.id) {
    const avatar = message.author.avatar;
    const uri = avatar ? `https://cdn.discordapp.com/avatars/${userId}/${avatar}.webp?size=128` : `https://cdn.discordapp.com/embed/avatars/${message.author.discriminator % 5}.png`
    return {
        image: { uri: uri },
        name: message.member?.nick ?? message.author.username
    }
}*/