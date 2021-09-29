import { Component, memo } from 'react'
import { DiscordChannelBase, DiscordGuild } from '../discord/discord-classes'
import Channels from './Channels'
import MainPage from './MainPage'

type SidebarProps = {
    selectedGuild: DiscordGuild | null
    selectedChannel: DiscordChannelBase | null
}

export default class Sidebar extends Component<SidebarProps> {
    render() {
        return (
            <div id='Sidebar' style={{
                height: '100%',
                width: 240,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <nav style={{
                    width: '100%',
                    display: 'flex',
                    flexGrow: 1,
                    flexDirection: 'column',
                    height: 'calc(100% - 53px)'
                }}>
                    <div style={{
                        width: 218,
                        paddingLeft: 16,
                        paddingRight: 16,
                        height: 48,
                        marginBottom: -2,
                        color: '#eeeeee',
                        flexShrink: 0
                    }}>
                        <h1 style={{
                            width: 186,
                            height: 20,
                            marginTop: 14,
                            fontWeight: 500,
                            fontSize: 15,
                            overflowX: 'hidden',
                            overflowY: 'hidden'
                        }}>
                            {this.props.selectedGuild?.name}
                        </h1>
                    </div>
                    <div style={{
                        width: '100%',
                        height: 2,
                        backgroundColor: '#131313'
                    }}/>
                    {
                    this.props.selectedGuild
                    ? <Channels guild={this.props.selectedGuild} selectedChannel={this.props.selectedChannel ?? undefined}/>
                    : <MainPage/>
                    }
                </nav>
                <UserInfo/>
            </div>
        )
    }
}

const UserInfo = memo(() => (
    <section style={{
        width: '100%',
        height: 53
    }}>
        UserInfo
    </section>
))
