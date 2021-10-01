import { Component } from 'react'
import { CallbackHandler, noCallback } from '../Callback'
import { DiscordChannelBase, DiscordGuildData } from '../discord/discord-classes'

const membersCH: CallbackHandler<any[]> = {
    callback: noCallback
}

export function updateMembers(members: any[]) {
    membersCH.callback(members)
}

type MemberListProps = {
    channel?: DiscordChannelBase
    guild?: DiscordGuildData
}

type MemberListState = {
    members: any[]
}

export default class MemberList extends Component<MemberListProps, MemberListState> {
    constructor(props: MemberListProps) {
        super(props)
        this.state = {
            members: []
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
                    {this.state.members.map((m, i) => {
                        const member = <Member key={i} member={m}/>
                        const notOffline = m.presence.status !== 'offline'
                        if ((hoistCache !== m.hoisted_role || !notOffline) && !atOffline) {
                            hoistCache = m.hoisted_role
                            const title = notOffline ? (hoistCache === null ? 'ONLINE' : this.props.guild?.roles.find(r => r.id === hoistCache)?.name?.toUpperCase()) : 'OFFLINE'
                            if (!notOffline) {
                                atOffline = true
                            }
                            return (
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
                        }
                        return member
                    })}
                </div>
            </aside>
        )
    }
}

type MemberProps = {
    member: any
}

class Member extends Component<MemberProps> {
    render() {
        const { image, name, status, platform } = getMember(this.props.member)
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
                            <mask id="svg-mask-avatar-status-offline"><rect width="40" height="32" fill="white"></rect><circle cx="27" cy="27" r="8.5" fill="black"></circle></mask>
                            <mask id="svg-mask-avatar-status-web"><rect width="40" height="32" fill="white"></rect><circle cx="27" cy="27" r="10" fill="black"></circle></mask>
                            <mask id="svg-mask-avatar-status-desktop"><rect width="40" height="32" fill="white"></rect><rect x="17" y="16.5" width="18" height="15.5" rx="3" fill="black"></rect></mask>
                            <mask id="svg-mask-avatar-status-mobile"><rect width="40" height="32" fill="white"></rect><rect x="19.2" y="16" width="18" height="20" rx="3" fill="black"></rect></mask>
                            <foreignObject x="0" y="0" width="32" height="32" mask={`url(#svg-mask-avatar-status-${platform})`}>
                                <div><img width="32" height="32" src={image} alt=" " style={{ borderRadius: '100%' }}/></div>
                            </foreignObject>
                            <mask id="svg-mask-status-offline"><circle fill="white" r="5" cx="27" cy="27"></circle><circle cx="27" cy="27" r="2.5" fill="black"></circle></mask>
                            <mask id="svg-mask-status-web"><svg x="19" y="19" width="16" height="16" viewBox="0 0 24 24"><path fill="white" d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.78 20 8.65 20 12C20 14.08 19.2 15.97 17.9 17.39Z"></path></svg></mask>
                            <mask id="svg-mask-status-desktop"><svg x="18.5" y="18" width="16" height="16" viewBox="0 0 24 24"><path fill="white" d="M4 2.5C2.897 2.5 2 3.397 2 4.5V15.5C2 16.604 2.897 17.5 4 17.5H11V19.5H7V21.5H17V19.5H13V17.5H20C21.103 17.5 22 16.604 22 15.5V4.5C22 3.397 21.103 2.5 20 2.5H4ZM20 4.5V13.5H4V4.5H20Z"></path></svg></mask>
                            <mask id="svg-mask-status-mobile"><svg x="18.5" y="18" width="18" height="18" viewBox="0 0 24 24"><g><path fill="white" d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z"></path></g></svg></mask>
                            <rect width="30" height="30" x="10" y="10" fill={status === 'online' ? 'rgb(59, 165, 93)' : status === 'idle' ? 'rgb(250, 168, 26)' : status === 'dnd' ? 'rgb(237, 66, 69)' : status === 'streaming' ? 'rgb(89, 54, 149)' : '#7f7f7f'} mask={`url(#svg-mask-status-${platform})`}/>
                        </svg>
                    </div>
                    <div style= {{
                        display: 'inline-block',
                        marginTop: 12
                    }}>
                        <span style={{
                            height: 18,
                            display: 'block'
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

function getMember(member: any) {
    const avatar = member.avatar ?? member.user.avatar;
    const image = avatar ? `https://cdn.discordapp.com/avatars/${member.user.id}/${avatar}.webp?size=128` : `https://cdn.discordapp.com/embed/avatars/${Number.parseInt(member.user.discriminator) % 5}.png`
    const status = member.presence.status
    const cs = member.presence.client_status
    const platform = cs.web === status ? 'web' : cs.desktop === status ? 'desktop' : cs.mobile === status ? 'mobile' : 'offline'
    return {
        image: image,
        name: member.nick ?? member.user.username,
        status: status,
        platform: platform,
    }
}

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