import { Component } from 'react'
import { colorIntToCss } from '../utils'
import { DiscordEmbed, DiscordMessageIn } from './discord-classes'
import { discordFormattedText } from './discord-message-formatting'

type EmbedProps = {
    embed: DiscordEmbed
    messageRef: DiscordMessageIn
}

export default class Embed extends Component<EmbedProps> {
    render() {
        const embed = this.props.embed
        if (!embed.image && !embed.title) {
            embed.image = embed.thumbnail
            embed.thumbnail = undefined
        }

        const author = embed.author ? (
            <div style={{
                marginTop: 8,
                width: 488,
                height: 24
            }}>
                <img alt={embed.author.name} src={embed.author.icon_url} style={{
                    width: 24,
                    height: 24,
                    marginRight: 8,
                    borderRadius: '100%',
                    float: 'left'
                }}/>
                <span style={{
                    fontSize: 14,
                    fontWeight: 600,
                    marginTop: 2,
                    color: '#eeeeee'
                }}>{discordFormattedText(embed.author.name, this.props.messageRef)}</span>
            </div>
        ) : null

        const title = embed.title ? (
            <div style={{
                marginTop: 8,
                fontSize: 16,
                fontWeight: 600,
                color: '#eeeeee'
            }}>
                {embed.url ? <a href={embed.url} target='_blank'>{discordFormattedText(embed.title, this.props.messageRef)}</a>
                 : discordFormattedText(embed.title, this.props.messageRef)}
            </div>
        ) : null
        
        const description = embed.description ? (
            <div style={{
                marginTop: 8,
                fontSize: 14,
                fontWeight: 400
            }}>
                {discordFormattedText(embed.description, this.props.messageRef)}
            </div>
        ) : null

        let fields: unknown = embed.fields?.map((field, index) => {
            return (
                <div style={{
                    gridColumnStart: 1,
                    gridColumnEnd: 13,
                    fontSize: '0.875rem',
                    lineHeight: '1.125rem',
                    minWidth: 0
                }}>
                    <span style={{
                        display: 'block',
                        marginBottom: 2,
                        height: 18,
                        fontWeight: 600,
                        color: '#eeeeee'
                    }}>{discordFormattedText(field.name, this.props.messageRef)}</span>
                    {discordFormattedText(field.value, this.props.messageRef)}
                </div>
            )
        })
        fields = !fields ? null : (fields as unknown[]).length > 0 ? (
            <div style={{
                display: 'grid',
                gridColumnStart: 1,
                gridColumnEnd: 1,
                gridGap: 8,
                marginTop: 8
            }}>
                {fields as any}
            </div>
        ) : null

        const footer = embed.footer ? (
            <div style={{
                marginTop: 8
            }}>
                <img src={embed.footer.icon_url} alt=" " style={{
                    width: 20,
                    height: 20,
                    marginRight: 8,
                    borderRadius: '100%',
                    float: 'left',
                    marginTop: 3
                }}/>
                <span style={{
                    fontSize: 12,
                    fontWeight: 500
                }}>{discordFormattedText(embed.footer.text, this.props.messageRef)}</span>
            </div>
        ) : null

        const sideThumbnail = !embed.video ? embed.thumbnail : undefined
        const thumbnail = sideThumbnail ? (
            <img src={sideThumbnail.url} alt=" " style={{
                marginLeft: 16,
                marginTop: 8,
                width: sideThumbnail.width ?? 80,
                height: sideThumbnail.height ?? 80,
                maxWidth: 80,
                maxHeight: 80,
                borderRadius: 3,
                gridRow: '1/8',
                gridColumn: '2/2',
            }}/>
        ) : null

        const image = embed.image ? (
            <img src={embed.image.url} alt=" " style={{
                maxWidth: 400,
                maxHeight: 400,
                borderRadius: 4,
                marginTop: 10,
                marginBottom: 2
            }}/>
        ) : null

        const video = embed.video ? (
            <video controls={embed.type !== 'gifv'} autoPlay={embed.type === 'gifv'} loop={embed.type === 'gifv'} src={embed.video.url} style={{
                width: 400,
                height: 225,
                borderRadius: 4
            }} width={embed.video.width} height={embed.video.height} poster={embed.thumbnail?.url}/>
        ) : null

        
        if (embed.type === 'gifv') {
            return (
                <div style={{
                    marginTop: 2,
                    marginBottom: 2
                }}>{video}</div>
            )
        }

        return (
            <div className="Embed" style={{
                borderColor: embed.color ? colorIntToCss(embed.color) : undefined,
                //borderWidth: 4
                display: embed.thumbnail ? 'grid' : undefined,
                marginTop: 2,
                marginBottom: 2,
                maxWidth: embed.image ? 400 : undefined
            }}>
                {author}
                {title}
                {description}
                {fields}
                {footer}
                {thumbnail}
                {image}
                {video}
            </div>
        )
    }
}

/*
{
  "type": "rich",
  "footer": {
    "text": "Minecord 0.13.3 | Made with ❤ by Tis_awesomeness",
    "proxy_icon_url": "https://images-ext-2.discordapp.net/external/PKSrp5Ry2Q_mXozKwZTMtW44BvNSYgCz176TgHtp0KY/https/cdn.discordapp.com/avatars/211261249386708992/a_92c3942b833157e5016b02de7203e428.gif",
    "icon_url": "https://cdn.discordapp.com/avatars/211261249386708992/a_92c3942b833157e5016b02de7203e428.gif"
  },
  "fields": [
    {
      "value": "`&guild`, `&role`, `&roles`, `&user`, `&purge`, `&perms`, `&settings`",
      "name": "General",
      "inline": false
    },
    {
      "value": "`&status`, `&sales`, `&codes`, `&color`, `&server`, `&shadow`, `&sha1`, `&item`, `&recipe`, `&ingredient`",
      "name": "Utility",
      "inline": false
    },
    {
      "value": "`&uuid`, `&history`, `&avatar`, `&head`, `&body`, `&skin`, `&cape`, `&profile`",
      "name": "Player",
      "inline": false
    },
    {
      "value": "`&help`, `&info`, `&invite`, `&vote`, `&credits`",
      "name": "Misc",
      "inline": false
    }
  ],
  "description": "Use `&help <command>` to get more information about a command.\nUse `&help <module>` to get help for that module.",
  "color": 65280,
  "author": {
    "proxy_icon_url": "https://images-ext-1.discordapp.net/external/HW8x9A-UtODlh7E2ZszI1eThjrfCMYkHGpHf20CTIJE/https/cdn.discordapp.com/avatars/292279711034245130/64a27869032ff234f84ec1261b9541ee.png",
    "name": "Minecord Help",
    "icon_url": "https://cdn.discordapp.com/avatars/292279711034245130/64a27869032ff234f84ec1261b9541ee.png"
  }
}*/