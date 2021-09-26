import { Component, createRef, RefObject } from 'react'
import './App.css'
import Sidebar from './sidebar/Sidebar'
import Guilds from './guildsbar/Guilds'
import ChatContainer from './chat/ChatContainer'
import isElectron from 'is-electron'
import Button from './components/Button'
import { DiscordClient } from './discord/DiscordClient'
import { DiscordChannelBase, DiscordGuild, DiscordIDK, DiscordRequestGuildMembers } from './discord/discord-classes'
import { CallbackHandler, noCallback } from './Callback'

const selectedGuildCH: CallbackHandler<DiscordGuild | null> = {
  callback: noCallback
}
export function selectGuild(guild: DiscordGuild | null) {
  console.log(`Select Guild: ${guild?.name}`)
  selectedGuildCH.callback(guild)
}

const selectedChannelCH: CallbackHandler<DiscordChannelBase | null> = {
  callback: noCallback
}
export function selectChannel(channel: DiscordChannelBase | null) {
  console.log(`Select Channel: ${channel?.name}`)
  selectedChannelCH.callback(channel)
}

let client: DiscordClient | undefined = undefined

export function currentClient() {
  return client
}


const keyListener = (e: KeyboardEvent) => {
  if (e.code === 'KeyR' && e.ctrlKey) window.electron.reloadPage()
  else if (e.code === 'KeyI' && e.ctrlKey && e.shiftKey) window.electron.devTools()
}

export default class App extends Component<{}, {
  selectedGuild: DiscordGuild | null
  selectedChannel: DiscordChannelBase | null
}> {
  private discordClient?: DiscordClient

  constructor(props: {}) {
    super(props)
    this.state = {
      selectedGuild: null,
      selectedChannel: null
    }
  }

  private currentGuild: DiscordGuild | null = null

  private selectedChannels: Map<string, string[]> = new Map()
  private selectedChannelsPayload: Map<string, { [name: string]: [[0, 99]] }> = new Map()

  componentDidMount() {
    console.log('App Component did mount')
    window.addEventListener('keypress', keyListener)

    selectedChannelCH.callback = channel => {
      console.log('Selecting Channel!')

      if (this.currentGuild && channel?.id) {
        const guildId = this.currentGuild.id

        window.localStorage.setItem(`selected_channel_${guildId}`, channel.id)

        console.log(this.selectedChannels)
        console.log(this.selectedChannelsPayload)
        let scs = this.selectedChannels.get(guildId)
        if (scs === undefined) {
          scs = []
          this.selectedChannels.set(guildId, [])
          this.selectedChannelsPayload.set(guildId, {})
        }
        //console.error(scs)
        //console.warn(channel.id !in scs)
        if (!scs.includes(channel.id)) {
          scs.push(channel.id)
          const p = this.selectedChannelsPayload.get(guildId)!
          p[channel.id] = [[0, 99]]
          console.log(scs)
          console.log(p)
        }
        this.discordClient?.ws.send(14, {
          guild_id: guildId,
          channels: this.selectedChannelsPayload.get(guildId)!,
          threads: true,
          activities: true,
          typing: true
        } as DiscordIDK)
        /*this.discordClient?.ws.send(8, {
          guild_id: guildId,
          user_ids: this.discordClient.userIds
        } as DiscordRequestGuildMembers)*/
      } else { console.warn(`No guild selected (Tried to select Channel ${channel?.name} on Guild ${this.currentGuild})`) }
      this.setState({ selectedChannel: channel })
    }
    selectedGuildCH.callback = guild => {
      console.log('Selecting guild')
      this.setState({ selectedGuild: guild })
      const scId = window.localStorage.getItem(`selected_channel_${guild?.id}`)
      const sc = (scId !== undefined ? guild?.channels?.find(c => c.id === scId) : undefined) ?? guild?.channels[0]
      this.currentGuild = guild
      if (sc) selectChannel(sc)
    }

    if (isElectron()) {
      console.log('Electron')
      console.log(window.electron)
      window.electron.ping()
    }
    let token = window.localStorage.getItem('token')
    if (!token) {
      token = 'ODg3MzM4OTU4NDUzODY2NTU3.YUCs2A.XZz40Vz7W5foc3vYrrhG0Zhs6ts'
      window.localStorage.setItem('token', token)
    }
    this.discordClient = new DiscordClient(token)
    client = this.discordClient
    this.discordClient.login()
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', keyListener)

    selectedGuildCH.callback = noCallback
    selectedChannelCH.callback = noCallback

    this.discordClient?.close()
    client = undefined
  }

  render() {
    return (
      <div className='full-size'>
        {isElectron() ? <AppBar/> : null}
        <div className='row' style={{
          height: isElectron() ? 'calc(100% - 22px)' : '100%',
        }}>
          <Guilds selectedGuild={this.state.selectedGuild}/>
          <Sidebar selectedGuild={this.state.selectedGuild} selectedChannel={this.state.selectedChannel}/>
          <ChatContainer selectedChannel={this.state.selectedChannel}/>
        </div>
      </div>
    )
  }
}

const AppBar = () => (
  <div className='AppBar' style={{
    height: 22,
    width: '100%',
    backgroundColor: '#131313',
    display: 'flex',
    flexDirection: 'row',
    color: '#dddddd'
  }}>
    <div style={{
      flexGrow: 1
    }}>
      ChaosCord
    </div>
    <AppBarIcon action='minimize'>
      <svg aria-hidden="false" width="12" height="12" viewBox="0 0 12 12"><rect fill="currentColor" width="10" height="1" x="1" y="6"></rect></svg>
    </AppBarIcon>
    <AppBarIcon action='maximize'>
      <svg aria-hidden="false" width="12" height="12" viewBox="0 0 12 12"><rect width="9" height="9" x="1.5" y="1.5" fill="none" stroke="currentColor"></rect></svg>
    </AppBarIcon>
    <AppBarIcon action='close'>
    <svg aria-hidden="false" width="12" height="12" viewBox="0 0 12 12"><polygon fill="currentColor" fill-rule="evenodd" points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"></polygon></svg>
    </AppBarIcon>
  </div>
)

const AppBarIcon = ({ children, action }: { children: any, action: 'minimize' | 'maximize' | 'close' }) => (
  <Button
  style={{
    width: 28,
    height: 22
  }}
  hoverStyle={{
    backgroundColor: action === 'close' ? '#ff0000' : '#7f7f7f7f'
  }}
  onClick={() => window.electron.windowButton(action) }
  >
    <div 
    style={{
      width: 12,
      height: 12,
      marginLeft: 7,
      marginRight: 7,
    }}
    >
      {children}
    </div>
  </Button>
)