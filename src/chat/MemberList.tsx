import { Component } from 'react'
import { DiscordChannelBase } from '../discord/discord-classes'

type MemberListProps = {
    channel?: DiscordChannelBase
}

export default class MemberList extends Component<MemberListProps> {
    constructor(props: MemberListProps) {
        super(props)
    }

    render() {
        return (
            <aside id='MemberList' style={{
                width: 240,
                flexShrink: 0,
            }}>
                <div role='list' style={{
                    paddingBottom: 20
                }}>
                    Members
                </div>
            </aside>
        )
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
                    {
                        role: 'Chef',
                        online: 1,
                        data: [
                            {
                                name: 'FauxKiwi',
                                image: {
                                    uri: 'https://cdn.discordapp.com/avatars/353603367907360768/fb1949c8f45cbec1d2568d4bab9e874e.webp?size=128'
                                },
                                status: 'Online'
                            }
                        ]
                    },
                    {
                        role: 'everyone',
                        online: 2,
                        data: [
                            {
                                name: 'HW100',
                                image: {
                                    uri: 'https://cdn.discordapp.com/avatars/338357156049059842/a_d78a09e6d879cebe0bb0771e566cb4cf.webp?size=128'
                                },
                                status: 'Online'
                            },
                            {
                                name: 'LOENS2',
                                image: {
                                    uri: 'https://cdn.discordapp.com/avatars/312984633614663680/1bed175b23d46130720c19b5c4f3677a.webp?size=128'
                                },
                                status: 'Online'
                            }
                        ]
                    }
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