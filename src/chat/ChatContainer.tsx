import { Component } from 'react'
import { CallbackHandler, noCallback } from '../Callback'
import Header from './Header';
import MemberList from './MemberList';
import ChatArea from './ChatArea';
import { DiscordChannelBase, DiscordGuildData } from '../discord/discord-classes';
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
    guild: DiscordGuildData | null
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
                {this.props.guild?.id && this.props.selectedChannel ? <div className='row'>
                    <ChatArea guildId={this.props.guild?.id} channel={this.props.selectedChannel}/>
                    {this.state.memberListVisible && this.props.selectedChannel.type !== 6 ? <MemberList channel={this.props.selectedChannel} guild={this.props.guild}/> : null}
                </div> : <Library/>}
            </div>
        )
    }
}