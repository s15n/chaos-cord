import { Component } from 'react'
import { CallbackHandler, noCallback } from '../Callback'
import { DiscordGuild } from '../discord/classes/DiscordGuild'
import { DiscordMember, DiscordMemberManager } from '../discord/classes/DiscordMember'
import { DiscordChannelBase } from '../discord/discord-classes'

const membersCH: CallbackHandler<DiscordMemberManager> = {
    callback: noCallback
}

export function updateMembers(members: DiscordMemberManager) {
    membersCH.callback(members)
}

type MemberListProps = {
    channel?: DiscordChannelBase
    guild?: DiscordGuild
}

type MemberListState = {
    members: DiscordMemberManager | null
}

export default class MemberList extends Component<MemberListProps, MemberListState> {
    constructor(props: MemberListProps) {
        super(props)
        this.state = {
            members: null
        }
    }

    componentDidMount() {
        membersCH.callback = m => {
            this.setState({ members: m })
        }
    }

    componentWillUnmount() {
        membersCH.callback = noCallback
    }

    render() {
        let hoistCache: string | null | undefined = undefined
        let atOffline = false

        const membersComponents: any[] = []
        this.state.members?.cache?.forEach((m, i) => {
            const member = <Member key={i} member={m}/>
            const notOffline = m.presence.status !== 'offline'
            if ((hoistCache !== m.hoistedRoleId || !notOffline) && !atOffline) {
                hoistCache = m.hoistedRoleId
                const title = notOffline ? (hoistCache === null ? 'ONLINE' : m.roles.resolve(hoistCache)?.name?.toUpperCase()) : 'OFFLINE'
                if (!notOffline) {
                    atOffline = true
                }
                membersComponents.push(
                    <>
                    <div style={{
                        paddingLeft: 16,
                        paddingTop: 24,
                        paddingRight: 8,
                        color: '#7f7f7f',
                        fontSize: '12px',
                        fontWeight: 600
                    }}>{title}</div>
                    {member}
                    </>
                )
            } else {
                membersComponents.push(member)
            }
        })

        return (
            <aside id='MemberList' style={{
                width: 240,
            }}>
                <div role='list' style={{
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    height: 'calc(100% - 72px)',
                    position: 'absolute',
                    width: 'inherit',
                }}>
                    {membersComponents}
                </div>
            </aside>
        )
    }
}

type MemberProps = {
    member: DiscordMember
}

class Member extends Component<MemberProps> {
    render() {
        //const { image, name, status, platform } = getMember(this.props.member)
        const member = this.props.member

        const image = member.displayAvatarURL({ format: 'webp', size: 128 })!
        const name = member.displayName
        const status = member.presence.status
        const cs = member.presence.client_status
        const platform = cs?.web === status ? 'web' : cs?.desktop === status ? 'desktop' : cs?.mobile === status ? 'mobile' : 'offline'

        let color: any = member.displayColor ?? 0x7f7f7f
        color = color ? `${color >> 16} ${(color >> 8) & 0xff} ${color & 0xff}` : '127 127 127'
        color = status !== 'offline' ? `rgb(${color})` : `rgb(${color} / 30%)`
        
        return (
            <div style={{
                width: 224,
                height: 42,
                marginLeft: 8,
                paddingTop: 1,
                paddingBottom: 1,
                color: '#7f7f7f',
                fontSize: 16,
                fontWeight: 500
            }}>
                <div style={{
                    paddingLeft: 8,
                    paddingRight: 8,
                }}>
                    <div role="img" aria-label="T0tallyR3al, Online" style={{
                        width: 32,
                        height: 32,
                        marginRight: 12,
                        marginTop: 8,
                        float: 'left'
                    }}>
                        <svg width="40" height="40" viewBox="0 4 40 32">
                            <foreignObject x="0" y="0" width="32" height="32" mask={`url(#svg-mask-avatar-status-${platform})`}>
                                <div><img width="32" height="32" src={image} alt=" " style={{ borderRadius: '100%' }}/></div>
                            </foreignObject>
                            <rect width="30" height="30" x="10" y="10" fill={status === 'online' ? 'rgb(59, 165, 93)' : status === 'idle' ? 'rgb(250, 168, 26)' : status === 'dnd' ? 'rgb(237, 66, 69)' : status === 'streaming' ? 'rgb(89, 54, 149)' : '#7f7f7f'} mask={`url(#svg-mask-status-${platform})`}/>
                        </svg>
                    </div>
                    <div style= {{
                        display: 'inline-block',
                        marginTop: 12
                    }}>
                        <span style={{
                            height: 18,
                            display: 'block',
                            color: color
                        }}>{name}</span>
                        {/*<span style={{
                            display: 'block',
                            fontSize: 12,
                            fontWeight: 500
                        }}>Playing</span>*/}
                    </div>
                </div>
            </div>
        )
    }
}

/*function getMember(member: DiscordMember) {
    const avatar = member.avatar ?? member.user.avatar;
    const image = avatar ? `https://cdn.discordapp.com/avatars/${member.user.id}/${avatar}.webp?size=128` : `https://cdn.discordapp.com/embed/avatars/${Number.parseInt(member.user.discriminator) % 5}.png`
    const status = member.presence.status
    const cs = member.presence.client_status
    const platform = cs.web === status ? 'web' : cs.desktop === status ? 'desktop' : cs.mobile === status ? 'mobile' : 'offline'
    return {
        image: member.displayAvatarURL({ format: 'webp', size: 128 })!,
        name: member.nick ?? member.user.username,
        status: status,
        platform: platform,
    }
}*/

/*
const MembersList = () => {
    return (
        <View style={[universalStyle.container, membersListStyles.topContainer]}>
            <View style={{
                height: '100%',
                paddingBottom: 20
            }}>
                <SectionList
                sections={[
                    
                ]}
                renderItem={({item}) => <Member name={item.name} image={item.image} status={item.status}/>}
                renderSectionHeader={(c) => <RoleHeader name={c.section.role} online={c.section.online}/>}
                stickySectionHeadersEnabled={true}
                />
            </View>
        </View>
    )
}

const Member = ({name, image, status}) => {
    return (
        <View style={membersListStyles.memberContainer1}>
            <View style={membersListStyles.memberContainer2}>
                <View style={{
                    width: 32,
                    height: 32,
                    marginRight: 12,
                    marginTop: 8,
                }}>
                    <Image style={membersListStyles.avatar} source={image}/>
                    {/*<svg width="40" height="32" viewBox="0 0 40 32" class="mask-1l8v16 svg-2V3M55" aria-hidden="true"><foreignObject x="0" y="0" width="32" height="32" mask="url(#svg-mask-avatar-status-round-32)"><div class="avatarStack-2Dr8S9"><img src="https://cdn.discordapp.com/avatars/353603367907360768/fb1949c8f45cbec1d2568d4bab9e874e.webp?size=128" alt=" " class="avatar-VxgULZ" aria-hidden="true"/></div></foreignObject><rect width="10" height="10" x="22" y="22" fill="hsl(139, calc(var(--saturation-factor, 1) * 47.3%), 43.9%)" mask="url(#svg-mask-status-online)" class="pointerEvents-2zdfdO"></rect></svg>*//*
                    </View>
                    <View style={{
                        width: '100%',
                        height: 18,
                        marginVertical: 12
                    }}>
                        <Text style={[universalStyle.text, membersListStyles.username]}>{name}</Text>
                    </View>
                </View>
            </View>
        );
    }
    
    const RoleHeader = ({name, online}) => {
        return (
            <Text style={[universalStyle.text, membersListStyles.roleHeader]}>{`${name === 'everyone' ? 'ONLINE' : name.toUpperCase()} — ${online}`}</Text>
        );
    }
    
    const membersListStyles = StyleSheet.create({
        topContainer: {
            width: 240,
            height: '100%',
            backgroundColor: colors.menu,
            marginTop: 2,
            flexShrink: 0,
        },
        memberContainer1: {
            width: 224,
            height: 42,
            marginLeft: 8,
            paddingVertical: 1
        },
        memberContainer2: {
            paddingHorizontal: 8,
            flexDirection: "row"
        },
        avatar: {
            width: 32,
            height: 32,
            borderRadius: '50%'
        },
        roleHeader: {
            paddingLeft: 16,
            paddingTop: 24,
            paddingRight: 8,
            color: colors.infoText,
            fontSize: '12px',
            fontWeight: 600
        },
        username: {
            color: colors.infoText,
            fontSize: '16px',
            fontWeight: 500
        }
    })*/