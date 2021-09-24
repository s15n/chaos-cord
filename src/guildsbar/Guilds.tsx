import { Component } from "react";
import { selectGuild } from "../App";
import { CallbackHandler, noCallback } from "../Callback";
import { DiscordGuild } from "../discord/discord-classes";
import "./Guilds.css"

const guildsCallback: CallbackHandler<DiscordGuild[]> = {
    callback: noCallback
}

export function setGuilds(guilds: DiscordGuild[]) {
    guildsCallback.callback(guilds)
}

type GuildsProps = {
    selectedGuild: DiscordGuild | null
}

type GuildsState = {
    guilds: DiscordGuild[]
}

export default class Guilds extends Component<GuildsProps, GuildsState> {
    constructor(props: GuildsProps) {
        super(props)
        this.state = {
            guilds: []
        }
    }

    _setGuilds = (guilds: DiscordGuild[]) => this.setState ({
        guilds: guilds
    })

    componentDidMount() {
        guildsCallback.callback = this._setGuilds
    }

    componentWillUnmount() {
        guildsCallback.callback = noCallback
    }

    _guildsComponents() {
        const guilds: any[] = [
            <GuildIcon key="-1" selected={this.props.selectedGuild === null}/>,
            <div style={{
                width: 32,
                height: 2,
                marginLeft: 20,
                marginBottom: 8,
                backgroundColor: '#7f7f7f7f',
            }}/>
        ]
        this.state.guilds.forEach((guild, index) => {
            guilds.push(
                <GuildIcon key={index} guild={guild} selected={this.props.selectedGuild === guild}/>
            )
        })
        return guilds
    }

    render() {
        return (
            <nav id='Guilds' style={{ //className='full-height'
                height: '100%',
                width: 72,
                overflowX: 'hidden',
                overflowY: 'auto',
            }}>
                <div style={{ height: 14 }}/>
                {this._guildsComponents()}
            </nav>
        )
    }
}

class GuildIcon extends Component<{
    guild?: DiscordGuild
    selected: boolean
}, {
    hover: boolean
}> {
    constructor(props: { guild?: DiscordGuild, selected: boolean }) {
        super(props)
        this.state = {
            hover: false
        }
    }

    _image() {
        return this.props.guild ? (
            <img
            src={`https://cdn.discordapp.com/icons/${this.props.guild.id}/${this.props.guild.icon}.png?size=128`}
            alt={this.props.guild.name}
            style={{
                width: '100%',
                height: '100%',
                borderRadius: this.state.hover ? 18 : 24,
                color: '#7f7f7f7f'
            }}
            />
        ) : (
            <div style={{
                width: '100%',
                height: '100%',
                borderRadius: this.props.selected || this.state.hover ? 18 : 24,
                backgroundColor: this.props.selected || this.state.hover ? '#4e5d94' : '#7f7f7f7f',
                color: '#cccccc',
                //marginTop: 14
            }}>
                <div style={{
                    paddingTop: 14,
                    paddingLeft: 10,
                }}>
                    <svg aria-hidden="false" width="28" height="20" viewBox="0 0 28 20"><path fill="currentColor" d="M23.0212 1.67671C21.3107 0.879656 19.5079 0.318797 17.6584 0C17.4062 0.461742 17.1749 0.934541 16.9708 1.4184C15.003 1.12145 12.9974 1.12145 11.0283 1.4184C10.819 0.934541 10.589 0.461744 10.3368 0.00546311C8.48074 0.324393 6.67795 0.885118 4.96746 1.68231C1.56727 6.77853 0.649666 11.7538 1.11108 16.652C3.10102 18.1418 5.3262 19.2743 7.69177 20C8.22338 19.2743 8.69519 18.4993 9.09812 17.691C8.32996 17.3997 7.58522 17.0424 6.87684 16.6135C7.06531 16.4762 7.24726 16.3387 7.42403 16.1847C11.5911 18.1749 16.408 18.1749 20.5763 16.1847C20.7531 16.3332 20.9351 16.4762 21.1171 16.6135C20.41 17.0369 19.6639 17.3997 18.897 17.691C19.3052 18.4993 19.7718 19.2689 20.3021 19.9945C22.6677 19.2689 24.8929 18.1364 26.8828 16.6466H26.8893C27.43 10.9731 25.9665 6.04728 23.0212 1.67671ZM9.68041 13.6383C8.39754 13.6383 7.34085 12.4453 7.34085 10.994C7.34085 9.54272 8.37155 8.34973 9.68041 8.34973C10.9893 8.34973 12.0395 9.54272 12.0187 10.994C12.0187 12.4453 10.9828 13.6383 9.68041 13.6383ZM18.3161 13.6383C17.0332 13.6383 15.9765 12.4453 15.9765 10.994C15.9765 9.54272 17.0124 8.34973 18.3161 8.34973C19.6184 8.34973 20.6751 9.54272 20.6543 10.994C20.6543 12.4453 19.6184 13.6383 18.3161 13.6383Z"></path></svg>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div style={{
                    width: 72,
                    height: 48,
                    marginBottom: 8,
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: 4,
                        marginRight: 4,
                        height: this.props.selected ? 48 : this.state.hover ? 18 : 0,
                        marginTop: this.props.selected ? 0 : this.state.hover ? 15 : 0,
                        borderTopRightRadius: 8,
                        borderBottomRightRadius: 8,
                        backgroundColor: '#bbbbbb',
                        float: 'left',
                    }}>
                    </div>
                    <div 
                    style={{
                        width: 48,
                        height: 48,
                        marginLeft: 12,
                        overflow: 'hidden',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={() => this.setState({ hover: true })}
                    onMouseLeave={() => this.setState({ hover: false })}
                    onMouseDown={() => {
                        selectGuild(this.props.guild ?? null)
                     }}
                    >
                        {this._image()}
                    </div>
                </div>
        )
    }
}