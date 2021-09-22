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

export default class ChatContainer extends Component<{}, {
    memberListVisible: boolean
    channel?: DiscordChannelBase
    loadMessages: boolean
}> {
    constructor(props: {}) {
        super(props);
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
        return (
            <div id='ChatContainer' className='column' style={{
                height: '100%'
            }}>
                <Header channelName={this.state.channel?.name}/>
                {this.state.channel ? <div className='row'>
                    <ChatArea channel={this.state.channel}/>
                    {this.state.memberListVisible ? <MemberList/> : null}
                </div> : <Library/>}
            </div>
        )
    }
}