import { Component, memo } from 'react'
import { DiscordChannelBase, DiscordGuild } from '../discord/discord-classes'
import Channels from './Channels'

export default class Sidebar extends Component<{}, {
    selectedGuild?: DiscordGuild
    selectedChannel?: DiscordChannelBase
}> {
    constructor(props: {}) {
        super(props)
        this.state = {}
    }

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
                    flexDirection: 'column'
                }}>
                    <div style={{
                        width: 218,
                        paddingLeft: 16,
                        paddingRight: 16,
                        height: 48,
                        marginBottom: -2,
                        color: '#eeeeee'
                    }}>
                        <h1 style={{
                            width: 186,
                            height: 20,
                            marginTop: 14,
                            fontWeight: 500,
                            fontSize: 15
                        }}>
                            {this.state.selectedGuild?.name}
                        </h1>
                    </div>
                    <div style={{
                        width: '100%',
                        height: 2,
                        backgroundColor: '#131313'
                    }}/>
                    {this.state.selectedGuild ? <Channels guild={this.state.selectedGuild} selectedChannel={this.state.selectedChannel}/> : <>
                    <div style={{
                        marginLeft: 8,
                        paddingTop: 1,
                        paddingBottom: 1
                    }}>
                        
                    </div>
                    </>}
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
