import { Component } from 'react'
import { CallbackHandler, noCallback } from '../Callback'
import Header from './Header';
import MemberList from './MemberList';
import ChatArea from './ChatArea';
import { DiscordChannelBase } from '../discord/discord-classes';
import Library from '../library/Library';

const memberListHandler: CallbackHandler<boolean> = {
    callback: noCallback
}

let memberListVisible = true;

export function toggleMemberListVisible() {
    memberListHandler.callback(!memberListVisible)
    memberListVisible = !memberListVisible
}

export function isMemberListVisible() {
    return memberListVisible
}

type ChatContainerProps = {
    selectedChannel: DiscordChannelBase | null
}

export default class ChatContainer extends Component<ChatContainerProps, {
    memberListVisible: boolean
    loadMessages: boolean
}> {
    constructor(props: ChatContainerProps) {
        super(props)
        this.state = {
            memberListVisible: true,
            loadMessages: false
        }
    }

    componentDidMount() {
        memberListHandler.callback = visible => this.setState({
            memberListVisible: visible
        })
    }

    componentWillUnmount() {
        memberListHandler.callback = noCallback
    }

    render() {
        console.log('Re-Rendering Chat Container')
        return (
            <div id='ChatContainer' className='column' style={{
                height: '100%'
            }}>
                <Header channelName={this.props.selectedChannel?.name}/>
                {this.props.selectedChannel ? <div className='row'>
                    <ChatArea channel={this.props.selectedChannel}/>
                    {this.state.memberListVisible ? <MemberList/> : null}
                </div> : <Library/>}
            </div>
        )
    }
}