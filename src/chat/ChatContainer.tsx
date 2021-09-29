import { Component } from 'react'
import { CallbackHandler, noCallback } from '../Callback'
import Header from './Header';
import MemberList from './MemberList';
import ChatArea from './ChatArea';
import { DiscordChannelBase } from '../discord/discord-classes';
import Library from '../library/Library';

import './ChatContainer.css'

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
    guildId: string | null
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
            <div id='ChatContainer' className='column'>
                <Header channelName={this.props.selectedChannel?.name}/>
                {this.props.guildId && this.props.selectedChannel ? <div className='row'>
                    <ChatArea guildId={this.props.guildId} channel={this.props.selectedChannel}/>
                    {this.state.memberListVisible && this.props.selectedChannel.type !== 6 ? <MemberList/> : null}
                </div> : <Library/>}
            </div>
        )
    }
}