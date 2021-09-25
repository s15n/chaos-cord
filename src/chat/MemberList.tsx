import { type } from 'os'
import { Component } from 'react'
import { CallbackHandler, noCallback } from '../Callback'
import { DiscordChannelBase } from '../discord/discord-classes'

const membersCH: CallbackHandler<any[]> = {
    callback: noCallback
}

export function updateMembers(members: any[]) {
    membersCH.callback(members)
}

type MemberListProps = {
    channel?: DiscordChannelBase
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
                    {this.state.members.map((m, i) => <Member key={i} member={m}/>)}
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
        const { image, name } = getMember(this.props.member)
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
                    <img src={image} alt={name} style={{
                        width: 32,
                        height: 32,
                        marginRight: 12,
                        marginTop: 8,
                        borderRadius: '100%',
                        float: 'left'
                    }}/>
                    <span style={{
                        height: 18,
                        marginTop: 13,
                        display: 'inline-block'
                    }}>{name}</span>
                </div>
            </div>
        )

        /*
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
            </View>*/

            /*
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
        username: {
            color: colors.infoText,
            fontSize: '16px',
            fontWeight: 500
        }*/
    }
}

function getMember(member: any) {
    const avatar = member.avatar ?? member.user.avatar;
    const image = avatar ? `https://cdn.discordapp.com/avatars/${member.user.id}/${avatar}.webp?size=128` : `https://cdn.discordapp.com/embed/avatars/${Number.parseInt(member.user.discriminator) % 5}.png`
    return {
        image: image,
        name: member.nick ?? member.user.username
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