import { Component } from 'react'
import Button from '../components/Button'
import { DiscordChannel } from '../discord/discord-classes'
import { DiscordClient } from '../discord/DiscordClient'
import './StorePage.css'

type StorePageProps = {
    channel: DiscordChannel<6>
}

type StorePageState = {
    page: any | undefined
}

export default class StorePage extends Component<StorePageProps, StorePageState> {
    // https://discord.com/api/v9/channels/856418752275152907/store-listing?country_code=DE
    private prevCID: string

    constructor(props: StorePageProps) {
        super(props)

        this.prevCID = props.channel.id

        this.state = {
            page: undefined
        }
    }

    fetchPage() {
        DiscordClient.request('GET', ['channels', this.props.channel.id, 'store-listing'], undefined, undefined, ['country_code=US']).then(value => 
            value.json()
        ).then(page => {
            this.setState({ page: page })
        })
    }

    componentDidMount() {
        this.fetchPage()
    }

    componentDidUpdate() {
        if (this.props.channel.id !== this.prevCID) {
            this.prevCID = this.props.channel.id
            this.fetchPage()
        }
    }

    render() {
        if (!this.state.page) return (
            <></>
        )
        const page = this.state.page
        const id = page.sku.id

        const carousel = page.carousel_items

        return (
            <div style={{
                //height: '-webkit-fill-available',
                paddingRight: 16,
                overflowX: 'hidden',
                overflowY: 'auto',
                position: 'fixed',
                left: 312,
                right: 8,
                top: 70,
                bottom: 0
            }}>
                <div style={{
                    maxWidth: 880,
                    margin: 'auto',
                    height: 100
                }}>
                    <div style={{
                        height: '100%',
                        width: '100%',
                        backgroundImage: `url("https://cdn.discordapp.com/app-assets/${id}/store/${page.header_background.id}.png?size=1024")`,
                        WebkitMask: 'radial-gradient(ellipse 50% 100% at 50% 0,#000,transparent)',
                        opacity: 0.3,
                        marginBottom: -100
                    }}/>
                    <img src={`https://cdn.discordapp.com/app-assets/${id}/store/${page.header_logo_dark_theme.id}.png?size=1024`} alt=" " style={{
                        display: 'block',
                        margin: 'auto',
                        paddingTop: 20,
                        paddingBlock: 20,
                        WebkitMask: 'revert',
                        opacity: 'revert'
                    }}/>
                </div>
                <div style={{
                   maxWidth: 880,
                   margin: 'auto'
                }}>
                    <div style={{
                        width: '100%'
                    }}>
                        <video src={`https://cdn.discordapp.com/app-assets/${id}/store/${carousel[0].asset_id}.mp4`} style={{
                            width: '100%',
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
                    maxWidth: 880,
                    margin: 'auto',
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
                            }}>About {page.sku.name}</h1>
                            <div style={{
                                marginBottom: 20,
                                borderBottom: '1px solid #66666666'
                            }}/>
                            <div>
                                <div style={{
                                    color: '#bbbbbb'
                                }}>
                                    {page.summary}
                                </div>
                                <div style={{
                                    color: '#999999',
                                    fontSize: 15,
                                    marginTop: 20,
                                }} className="collapsed">
                                    {page.description}
                                </div>
                            </div>
                            <Button style={{
                                display: 'block',
                                padding: '2px 16px',
                                marginTop: 20,
                                height: 34,
                                border: 'none',
                                borderRadius: 4,
                                backgroundColor: '#99999999',
                                color: '#ffffffff',
                                fontSize: 14,
                                fontWeight: 500,
                            }}>Read more</Button>
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
                                    <div style={{
                                        height: 24,
                                        marginBottom: 4
                                    }}>
                                        <div>GET GAME</div>
                                    </div>
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

/*
{
    "id": "633200201016016896",
    "summary": "Retrograde Arena is a multiplayer twin stick brawler where bullets don’t kill. Use weapons's impact to push other player to the deadly environment. Play together with others and prove that you're the best of 'em all.",
    "sku": {
        "id": "603145207516495879",
        "type": 1,
        "dependent_sku_id": null,
        "application_id": "603145207516495879",
        "manifest_labels": [
            "633166320967483402"
        ],
        "access_type": 1,
        "name": "Retrograde Arena",
        "features": [
            2,
            3,
            4,
            7,
            8,
            10,
            11
        ],
        "release_date": null,
        "premium": false,
        "slug": "retrograde-arena",
        "flags": 4,
        "genres": [
            1,
            27,
            63,
            23
        ],
        "application": {
            "id": "603145207516495879",
            "name": "Retrograde Arena Game",
            "icon": "b02e20f068f74c6ea60d29c7ace194e1",
            "description": "Retrograde Arena is a multiplayer twin stick brawler where bullets don’t kill. Use weapons's impact to push other player to the deadly environment. Play together with others and prove that you're the best of 'em all.",
            "summary": "Retrograde Arena is a multiplayer twin stick brawler where bullets don’t kill. Use weapons's impact to push other player to the deadly environment. Play together with others and prove that you're the best of 'em all.",
            "cover_image": "52963c8889b105f0ff07d33c1f9bf1d3",
            "primary_sku_id": "603145207516495879",
            "hook": true,
            "slug": "retrograde-arena-game",
            "guild_id": "293120529030840330",
            "bot_public": true,
            "bot_require_code_grant": false,
            "verify_key": "e675fb29eb5165d11a388548e70c92c008c3c4ccb88c1bb2ee6509b0895e6884",
            "publishers": [
                {
                    "id": "521816559031812100",
                    "name": "Another Indie"
                }
            ],
            "developers": [
                {
                    "id": "626341625383354368",
                    "name": "Freemergency"
                }
            ]
        },
        "system_requirements": {
            "1": {
                "minimum": {
                    "operating_system_version": "Windows 8",
                    "cpu": "Intel Pentium G4560",
                    "gpu": "Intel HD 4600",
                    "ram": 4000,
                    "disk": 300,
                    "sound_card": null,
                    "directx": null,
                    "network": "Broadband Internet connection",
                    "notes": "For Low Settings, 720p, 30 fps"
                },
                "recommended": {
                    "operating_system_version": "Windows 10",
                    "cpu": "Intel Core i5 Quad Core / Ryzen 3",
                    "gpu": "Nvidia GTX 1050 and equivalent or better",
                    "ram": 4000,
                    "disk": 300,
                    "sound_card": null,
                    "directx": null,
                    "network": "Broadband Internet connection",
                    "notes": "For High Settings, 1080p, 60 fps"
                }
            }
        },
        "show_age_gate": false,
        "price": {
            "amount": 0,
            "currency": "eur"
        },
        "locales": [
            "en-US",
            "en-GB"
        ]
    },
    "tagline": "Destroying friendship, one round at a time.",
    "description": "Retrograde Arena is a multiplayer twin stick brawler where bullets don’t kill, but the environment does. All weapons can only push players, but all players will instantly explode when they touch any red walls or objects in the map. Battle against other people or AI with up to 6 players in a hectic match and rebound them to their demise with a variety of different weapons.\n\n![](asset://637615155324387331)\n![](asset://633585921140195338)\n\n**Physics Based**\n\nUse physics to your advantage by using your own weapon’s recoil to evade or propel yourself to great speeds. Utilize bullets’ ricochet, push boxes, and body slam others to win.\n\n**Multiplayer Chaos**\n\nThis game features online & local multiplayer, play with friends on the same PC with multiple controllers, or use LAN or Internet to play with other people. Each PC supports up to 4 controllers (4 players) and can join any online match with up to 6 players.\n\n**Arsenal of Weapons**\n\nUse a variety of weapons with different properties. Some weapons just shoot bullets, some bounces back bullets, some are just there to screw with you. Machine guns, railguns, shotguns, we got'em all and more to come.\n\n**Diverse Arena**\n\nArenas or “Maps” will determine the experience of the match. Each arena has their own layout, and some have unique quirks that requires different strategies to win the game.\n\n**Customization**\n\nUnlock and choose different textures, thrusters and particle effects to personalize your ship. Look different and show off your achievements online.\n\n![](asset://633585953725743125)",
    "carousel_items": [
        {
            "asset_id": "712889602427322438"
        },
        {
            "asset_id": "637632002983591936"
        },
        {
            "asset_id": "637618770654789632"
        },
        {
            "asset_id": "637618774819864576"
        },
        {
            "asset_id": "633566394855850004"
        },
        {
            "asset_id": "633566488003084288"
        },
        {
            "asset_id": "633566537332031488"
        }
    ],
    "hero_video": {
        "id": "712889602427322438",
        "size": 21777372,
        "mime_type": "video/mp4",
        "width": 1280,
        "height": 720
    },
    "hero_background": {
        "id": "637549872517742592",
        "size": 3794951,
        "mime_type": "image/png",
        "width": 2480,
        "height": 1000
    },
    "preview_video": {
        "id": "637625703029932035",
        "size": 5217196,
        "mime_type": "video/mp4",
        "width": 640,
        "height": 360
    },
    "box_art": {
        "id": "712863933236510732",
        "size": 796572,
        "mime_type": "image/png",
        "width": 600,
        "height": 800
    },
    "thumbnail": {
        "id": "712863951049850960",
        "size": 1624832,
        "mime_type": "image/png",
        "width": 1280,
        "height": 720
    },
    "header_logo_dark_theme": {
        "id": "712863896494669906",
        "size": 23812,
        "mime_type": "image/png",
        "width": 300,
        "height": 60
    },
    "header_logo_light_theme": {
        "id": "712863896494669906",
        "size": 23812,
        "mime_type": "image/png",
        "width": 300,
        "height": 60
    },
    "header_background": {
        "id": "637161196771868692",
        "size": 173779,
        "mime_type": "image/png",
        "width": 880,
        "height": 100
    },
    "assets": [
        {
            "id": "637632002983591936",
            "size": 33216690,
            "mime_type": "video/mp4",
            "width": 1280,
            "height": 720
        },
        {
            "id": "637618770654789632",
            "size": 4926011,
            "mime_type": "image/png",
            "width": 1920,
            "height": 1080
        },
        {
            "id": "637618774819864576",
            "size": 4946616,
            "mime_type": "image/png",
            "width": 1920,
            "height": 1080
        },
        {
            "id": "633566488003084288",
            "size": 4854948,
            "mime_type": "image/png",
            "width": 1920,
            "height": 1080
        },
        {
            "id": "633566537332031488",
            "size": 5003217,
            "mime_type": "image/png",
            "width": 1920,
            "height": 1080
        },
        {
            "id": "637615155324387331",
            "size": 4501884,
            "mime_type": "image/gif",
            "width": 600,
            "height": 338
        },
        {
            "id": "712889602427322438",
            "size": 21777372,
            "mime_type": "video/mp4",
            "width": 1280,
            "height": 720
        },
        {
            "id": "633585921140195338",
            "size": 61335,
            "mime_type": "image/png",
            "width": 414,
            "height": 58
        },
        {
            "id": "633566394855850004",
            "size": 4877227,
            "mime_type": "image/png",
            "width": 1920,
            "height": 1080
        },
        {
            "id": "633585953725743125",
            "size": 1781441,
            "mime_type": "image/gif",
            "width": 400,
            "height": 305
        }
    ]
}
*/