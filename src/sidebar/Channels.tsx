import { Component, memo } from 'react'
import { selectChannel } from '../App'
import { DiscordChannelBase, DiscordGuild } from '../discord/discord-classes'

type ChannelsProps = {
    guild: DiscordGuild
    selectedChannel?: DiscordChannelBase
}

export default class Channels extends Component<ChannelsProps> {
    constructor(props: ChannelsProps) {
        super(props)
    }

    _channels() {
        const channels = this.props.guild.channels
        //channels.forEach(c => console.log(`${c.name} (${c.type}): ${c.position} [${!!c.parent_id}]`))
        //;([...channels].sort((a, b) => a.position - b.position)).forEach(c => console.log(`${c.name} (${c.type}): ${c.position} [${!!c.parent_id}]`))
        const rulesChannelId = this.props.guild.rules_channel_id

        type SC = {
            cid: string
            c?: DiscordChannelBase
            cat: boolean
            children: SC[]
        }
        const struct: SC[] = []

        for (const channel of channels) {
            if (channel.parent_id && (channel.type < 10 || channel.type > 12)) {
                let parent = struct.find(sc => sc.cid === channel.parent_id)
                if (!parent) {
                    parent = { cid: channel.parent_id, cat: true, children: [] }
                    struct.push(parent)
                }

                parent.children.push({
                    cid: channel.id,
                    c: channel,
                    cat: channel.type === 4,
                    children: []
                })

                continue
            }

            const existingSc = channel.type === 4 
                ? struct.find(sc => sc.cid === channel.id)
                : undefined
            if (existingSc) existingSc.c = channel

            const sc: SC = existingSc ?? {
                cid: channel.id,
                c: channel,
                cat: channel.type === 4,
                children: []
            }

            if (!existingSc) struct.push(sc)
        }

        const arr: any[] = []

        function push(selectedChannelId: string, struct: SC[]) {
            struct.sort((a, b) => (a.c!.position + (a.cat ? 999999 : 0)) - (b.c!.position + (b.cat ? 999999 : 0)))
            for (const sc of struct) {
                arr.push(<Channel channel={sc.c!} rules={sc.cid === rulesChannelId} selected={selectedChannelId === sc.cid}/>)
                if (sc.children.length > 0) {
                    push(selectedChannelId, sc.children)
                }
            }
        }
        push(this.props.selectedChannel?.id ?? 'null', struct)

        return arr
    }

    render() {
        return (
            <div style={{
                height: '100%',
                width: '100%',
                flexGrow: 1,
                color: '#aaaaaa',
                overflowX: 'hidden',
                overflowY: 'auto',
            }}>
                <div style={{
                    width: '100%',
                    height: 16
                }}/>
                {this._channels()}
            </div>
        )
    }
}

type ChannelProps = {
    channel: DiscordChannelBase
    rules: boolean
    selected: boolean
}

class Channel extends Component<ChannelProps, { hover: boolean }> {
    constructor(props: ChannelProps) {
        super(props)
        this.state = { hover: false }
    }

    render() {
        const channelType = this.props.channel.type
        return (
            <div style={{
                width: 224,
                paddingTop: 1,
                paddingBottom: 1,
                height: 32,
                paddingRight: 8,
                fontSize: channelType === 4 ? '12px' : '15px',
                fontWeight: channelType === 4 ? 600 : undefined,
                color: channelType === 4 ? '#dddddd' : '#bbbbbb'
            }}>
                <div 
                style={{
                    width: 200,
                    height: 28,
                    marginLeft: 8,
                    paddingLeft: 8,
                    paddingRight: 8,
                    overflowX: 'clip',
                    backgroundColor: channelType === 4 ? undefined : this.props.selected ? '#7f7f7f7f' : this.state.hover ? '#7f7f7f3f' : undefined,
                    borderRadius: 4,
                    paddingTop: channelType === 4 ? 12 : 4,
                    cursor: 'pointer'
                }}
                onMouseEnter={() => { this.setState({ hover: true }) }} 
                onMouseLeave={() => { this.setState({ hover: false }) }}
                onMouseDown={() => { if (this.props.channel.type !== 4) selectChannel(this.props.channel) }}
                >
                    <div style={{
                        width: 20,
                        height: 20,
                        marginRight: 8,
                        float: 'left',
                        marginTop: -1
                    }}>
                        {channelIcon(this.props.rules, channelType)}
                    </div>
                    {channelType === 4 ? this.props.channel.name.toUpperCase() : this.props.channel.name}
                </div>
            </div>
        )
        return (
            <div style={{
                width: 208,
                paddingTop: channelType === 4 ? 16 : 7,
                paddingBottom: 7,
                fontSize: channelType === 4 ? '12px' : '15px',
                fontWeight: channelType === 4 ? 600 : undefined
            }}>
                <div 
                style={{
                    width: '100%',
                    marginLeft: channelType === 4 ? 0 : 8,
                    paddingLeft: channelType === 4 ? 16 : 8,
                    paddingRight: 8,
                    height: 26,
                    marginBottom: -6,
                    display: 'flex',
                    flexDirection: 'row',
                    backgroundColor: channelType === 4 ? undefined : this.props.selected ? '#7f7f7f7f' : this.state.hover ? '#7f7f7f3f' : undefined,
                    borderRadius: 3,
                    cursor: 'pointer'
                }} 
                onMouseEnter={() => { this.setState({ hover: true }) }} 
                onMouseLeave={() => { this.setState({ hover: false }) }}
                onMouseDown={() => { if (this.props.channel.type !== 4) selectChannel(this.props.channel) }}
                >
                    <div style={{
                        width: 20,
                        height: 20,
                        marginRight: 8
                    }}>
                        {channelIcon(this.props.rules, channelType)}
                    </div>
                    {channelType === 4 ? this.props.channel.name.toUpperCase() : this.props.channel.name}
                </div>
            </div>
        )
    }
}

export function channelIcon(rules: boolean, type: number) {
    //return (<>{type}</>)
    if (rules) return channelIcons.rules
    if (type === 0) return channelIcons[0]
    if (type === 2) return channelIcons[2]
    if (type === 4) return channelIcons[4]
    if (type === 5) return channelIcons[5]
    if (type === 6) return channelIcons[6]
    if (type === 13) return channelIcons[13]
    if (type === 10 || type === 11 || type === 12) return channelIcons.thread
}

const channelIcons = {
    0: <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"></path></svg>,
    rules: <svg width="24" height="24" viewBox="0 0 40 40" fill="none" ><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M33 34.5833V7.49998H35V36.6666H9C6.791 36.6666 5 34.801 5 32.5V7.49998C5 5.19894 6.791 3.33331 9 3.33331H31V30.4166H9C7.8955 30.4166 7 31.3485 7 32.5C7 33.6515 7.8955 34.5833 9 34.5833H33ZM23.9718 9.99998L15.8889 17.9915L12.7086 14.8441L10 17.5058L15.8885 23.3333L26.6667 12.6669L23.9718 9.99998Z"></path></svg>,
    5: <svg width="24" height="24" viewBox="0 0 24 24"><path d="M3.9 8.26H2V15.2941H3.9V8.26Z" fill="currentColor"></path><path d="M19.1 4V5.12659L4.85 8.26447V18.1176C4.85 18.5496 5.1464 18.9252 5.5701 19.0315L9.3701 19.9727C9.4461 19.9906 9.524 20 9.6 20C9.89545 20 10.1776 19.8635 10.36 19.6235L12.7065 16.5242L19.1 17.9304V19.0588H21V4H19.1ZM9.2181 17.9944L6.75 17.3826V15.2113L10.6706 16.0753L9.2181 17.9944Z" fill="currentColor"></path></svg>,
    forbidden: <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17 11V7C17 4.243 14.756 2 12 2C9.242 2 7 4.243 7 7V11C5.897 11 5 11.896 5 13V20C5 21.103 5.897 22 7 22H17C18.103 22 19 21.103 19 20V13C19 11.896 18.103 11 17 11ZM12 18C11.172 18 10.5 17.328 10.5 16.5C10.5 15.672 11.172 15 12 15C12.828 15 13.5 15.672 13.5 16.5C13.5 17.328 12.828 18 12 18ZM15 11H9V7C9 5.346 10.346 4 12 4C13.654 4 15 5.346 15 7V11Z" aria-hidden="true"></path></svg>,
    13: <svg width="23" height="23" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M14 13C14 14.1 13.1 15 12 15C10.9 15 10 14.1 10 13C10 11.9 10.9 11 12 11C13.1 11 14 11.9 14 13ZM8.5 20V19.5C8.5 17.8 9.94 16.5 12 16.5C14.06 16.5 15.5 17.8 15.5 19.5V20H8.5ZM7 13C7 10.24 9.24 8 12 8C14.76 8 17 10.24 17 13C17 13.91 16.74 14.75 16.31 15.49L17.62 16.25C18.17 15.29 18.5 14.19 18.5 13C18.5 9.42 15.58 6.5 12 6.5C8.42 6.5 5.5 9.42 5.5 13C5.5 14.18 5.82 15.29 6.38 16.25L7.69 15.49C7.26 14.75 7 13.91 7 13ZM2.5 13C2.5 7.75 6.75 3.5 12 3.5C17.25 3.5 21.5 7.75 21.5 13C21.5 14.73 21.03 16.35 20.22 17.75L21.51 18.5C22.45 16.88 23 15 23 13C23 6.93 18.07 2 12 2C5.93 2 1 6.93 1 13C1 15 1.55 16.88 2.48 18.49L3.77 17.74C2.97 16.35 2.5 14.73 2.5 13Z" fill="currentColor"></path></svg>,
    2: <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M11.383 3.07904C11.009 2.92504 10.579 3.01004 10.293 3.29604L6 8.00204H3C2.45 8.00204 2 8.45304 2 9.00204V15.002C2 15.552 2.45 16.002 3 16.002H6L10.293 20.71C10.579 20.996 11.009 21.082 11.383 20.927C11.757 20.772 12 20.407 12 20.002V4.00204C12 3.59904 11.757 3.23204 11.383 3.07904ZM14 5.00195V7.00195C16.757 7.00195 19 9.24595 19 12.002C19 14.759 16.757 17.002 14 17.002V19.002C17.86 19.002 21 15.863 21 12.002C21 8.14295 17.86 5.00195 14 5.00195ZM14 9.00195C15.654 9.00195 17 10.349 17 12.002C17 13.657 15.654 15.002 14 15.002V13.002C14.551 13.002 15 12.553 15 12.002C15 11.451 14.551 11.002 14 11.002V9.00195Z" aria-hidden="true"></path></svg>,
    thread: <svg width="12" height="11" viewBox="0 0 12 11" fill="none"><path d="M11 9H4C2.89543 9 2 8.10457 2 7V1C2 0.447715 1.55228 0 1 0C0.447715 0 0 0.447715 0 1V7C0 9.20914 1.79086 11 4 11H11C11.5523 11 12 10.5523 12 10C12 9.44771 11.5523 9 11 9Z" fill="currentColor"></path></svg>,
    4: <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M16.59 8.59004L12 13.17L7.41 8.59004L6 10L12 16L18 10L16.59 8.59004Z"></path></svg>,
    6: <svg aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21.707 13.293l-11-11C10.519 2.105 10.266 2 10 2H3c-.553 0-1 .447-1 1v7c0 .266.105.519.293.707l11 11c.195.195.451.293.707.293s.512-.098.707-.293l7-7c.391-.391.391-1.023 0-1.414zM7 9c-1.106 0-2-.896-2-2 0-1.106.894-2 2-2 1.104 0 2 .894 2 2 0 1.104-.896 2-2 2z"></path></svg>
}

const channelIconOverlays = {
    restricted: <path fill="currentColor" d="M21.025 5V4C21.025 2.88 20.05 2 19 2C17.95 2 17 2.88 17 4V5C16.4477 5 16 5.44772 16 6V9C16 9.55228 16.4477 10 17 10H19H21C21.5523 10 22 9.55228 22 9V5.975C22 5.43652 21.5635 5 21.025 5ZM20 5H18V4C18 3.42857 18.4667 3 19 3C19.5333 3 20 3.42857 20 4V5Z"></path>,
    thread: <path fill="currentColor" d="M13.4399 12.96C12.9097 12.96 12.4799 13.3898 12.4799 13.92V20.2213C12.4799 20.7515 12.9097 21.1813 13.4399 21.1813H14.3999C14.5325 21.1813 14.6399 21.2887 14.6399 21.4213V23.4597C14.6399 23.6677 14.8865 23.7773 15.0408 23.6378L17.4858 21.4289C17.6622 21.2695 17.8916 21.1813 18.1294 21.1813H22.5599C23.0901 21.1813 23.5199 20.7515 23.5199 20.2213V13.92C23.5199 13.3898 23.0901 12.96 22.5599 12.96H13.4399Z"></path>
}

/*

        
        const arr: any[] = []
        let lastTopChannel = 0
        const ids = new Map<string, number>()

        let index = 0
        for (const channel of channels) {
            if (channel.parent_id) continue
            const cc = <Channel key={index} channel={channel} rules={channel.id === rulesChannelId} selected={this.props.selectedChannel?.id === channel.id}/>
            if (channel.type === 4) {
                arr.push(cc)
            } else {
                arr.splice(lastTopChannel, 0, cc)
                ++lastTopChannel
            }
            ids.set(channel.id, arr.length)
            ++index
        }
        ids.forEach((v, k) => {
            ids.set(k, v + lastTopChannel)
        })
        for (const channel of channels) {
            if (!channel.parent_id) continue
            const parentPos = ids.get(channel.parent_id)!
            const pos = parentPos + channel.position
            arr.splice(pos, 0, <Channel key={index} channel={channel} rules={channel.id === rulesChannelId} selected={this.props.selectedChannel?.id === channel.id}/>)
            ids.forEach((v, k) => {
                if (v > parentPos) ids.set(k, v + 1)
            })
            ++index
        }
*/