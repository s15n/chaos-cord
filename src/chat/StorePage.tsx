import Button from '@restart/ui/esm/Button'
import React, { Component } from 'react'
import { DiscordChannel } from '../discord/discord-classes'
import { DiscordClient } from '../discord/DiscordClient'
import { isMemberListVisible } from './ChatContainer'

type StorePageProps = {
    channel: DiscordChannel<6>
}

export default class StorePage extends Component<StorePageProps> {
    // https://discord.com/api/v9/channels/856418752275152907/store-listing?country_code=DE
    page: any | undefined = undefined

    constructor(props: StorePageProps) {
        super(props)

        DiscordClient.request('GET', ['channels', this.props.channel.id, 'store-listing'], undefined, undefined, ['country_code=DE']).then(value => 
            value.json()
        ).then(page => {
            this.page = page
        })
    }

    render() {
        return (
            <div style={{
                //height: '-webkit-fill-available',
                paddingRight: 16,
                overflowX: 'hidden',
                overflowY: 'auto',
                position: 'fixed',
                left: 312,
                right: isMemberListVisible() ? 248 : 8,
                top: 70,
                bottom: 0
            }}>
                <div style={{
                    marginLeft: 52.5,
                    marginRight: 52.5,
                    height: 100
                }}>
                    <div style={{
                        height: '100%',
                        width: '100%',
                        backgroundImage: `url("https://cdn.discordapp.com/app-assets/603145207516495879/store/637161196771868692.png?size=1024")`,
                        WebkitMask: 'radial-gradient(ellipse 50% 100% at 50% 0,#000,transparent)',
                        opacity: 0.3,
                        marginBottom: -100
                    }}/>
                    <img src={"https://cdn.discordapp.com/app-assets/603145207516495879/store/712863896494669906.png?size=1024"} alt=" " style={{
                        display: 'block',
                        margin: 'auto',
                        paddingTop: 20,
                        paddingBlock: 20,
                        WebkitMask: 'revert',
                        opacity: 'revert'
                    }}/>
                </div>
                <div style={{
                    width: '100%'
                }}>
                    <div style={{
                        width: '100%'
                    }}>
                        <video src="https://cdn.discordapp.com/app-assets/603145207516495879/store/712889602427322438.mp4" style={{
                            marginLeft: 52.5,
                            marginRight: 52.5,
                            width: 'calc(100% - 105px)',
                            borderRadius: 4
                        }} autoPlay loop muted controls/>
                    </div>
                    <div style={{
                        height: 97,
                        width: 'auto',
                        margin: '20px 32.5px 20px 32.5px',
                        paddingLeft: 20,
                        paddingRight: 20
                    }}>
                    </div>
                </div>
                <div style={{
                    marginLeft: 32.5,
                    marginRight: 32.5,
                    paddingLeft: 20,
                    paddingRight: 20,
                    width: 'auto',
                    height: 'auto',
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <div style={{
                            width: '67%'
                        }}>
                            <h1 style={{
                                marginTop: 0,
                                marginBottom: 8,
                                fontSize: 20,
                                fontWeight: 500,
                                color: '#eeeeee',
                                display: 'block'
                            }}>About Retrograde Arena</h1>
                            <div style={{
                                marginBottom: 20,
                                borderBottom: '1px solid #66666666'
                            }}/>
                            <div>
                                <div style={{
                                    color: '#bbbbbb'
                                }}>
                                    Retrograde Arena is a multiplayer twin stick brawler where bullets don’t kill. Use weapons's impact to push other player to the deadly environment. Play together with others and prove that you're the best of 'em all.
                                </div>
                                <div style={{
                                    color: '#999999',
                                    fontSize: 15,
                                    marginTop: 20
                                }}>
                                    Retrograde Arena is a multiplayer twin stick brawler where bullets don’t kill, but the environment does. All weapons can only push players, but all players will instantly explode when they touch any red walls or objects in the map. Battle against other people or AI with up to 6 players in a hectic match and rebound them to their demise with a variety of different weapons.
                                </div>
                            </div>
                            {/*<Button>Hi</Button>*/}
                        </div>
                        <div style={{
                            width: '33%',
                            marginLeft: 40
                        }}>
                            <div style={{
                                marginBottom: 40,
                            }}>
                                <div style={{
                                    padding: 20,
                                    backgroundColor: '#666666',
                                    borderTopLeftRadius: 4,
                                    borderTopRightRadius: 4
                                }}>

                                </div>
                                <div style={{
                                    padding: 20,
                                    backgroundColor: '#1c1c1c'
                                }}>

                                </div>
                                <div style={{
                                    padding: 20,
                                    backgroundColor: '#1c1c1c',
                                    borderBottomLeftRadius: 4,
                                    borderBottomRightRadius: 4,
                                    borderTop: '1px solid #66666666'
                                }}>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}