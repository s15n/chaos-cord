import { Component, createRef, RefObject } from 'react'
import './App.css'
import Sidebar from './sidebar/Sidebar'
import Guilds from './guildsbar/Guilds'
import ChatContainer from './chat/ChatContainer'
import isElectron from 'is-electron'
import Button from './components/Button'
import { DiscordClient } from './discord/DiscordClient'
import { DiscordChannelBase, DiscordGuild } from './discord/discord-classes'
import { CallbackHandler, noCallback } from './Callback'

const selectedGuildCH: CallbackHandler<DiscordGuild | null> = {
  callback: noCallback
}
export function selectGuild(guild: DiscordGuild | null) {
  console.log(`Select Guild: ${guild?.name}`)
  selectChannel(guild?.channels[0] ?? null) // TODO
  selectedGuildCH.callback(guild)
}

const selectedChannelCH: CallbackHandler<DiscordChannelBase | null> = {
  callback: noCallback
}
export function selectChannel(channel: DiscordChannelBase | null) {
  console.log(`Select Channel: ${channel?.name}`)
  selectedChannelCH.callback(channel)
}


const keyListener = (e: KeyboardEvent) => {
  console.log(e)
  console.log(e.ctrlKey)
  if (e.code === 'KeyR' && e.ctrlKey) window.electron.reloadPage()
  else if (e.code === 'KeyI' && e.ctrlKey && e.shiftKey) window.electron.devTools()
}

export default class App extends Component<{}, {
  selectedGuild: DiscordGuild | null
  selectedChannel: DiscordChannelBase | null
}> {
  _discordClient?: DiscordClient

  constructor(props: {}) {
    super(props)
    this.state = {
      selectedGuild: null,
      selectedChannel: null
    }
  }

  componentDidMount() {
    console.log('App Component did mount')
    window.addEventListener('keypress', keyListener)

    selectedGuildCH.callback = guild => {
      this.setState({ selectedGuild: guild })
    }
    selectedChannelCH.callback = channel => {
      this.setState({ selectedChannel: channel })
    }

    if (isElectron()) {
      console.log('Electron')
      console.log(window.electron)
      window.electron.ping()
    }
    this._discordClient = new DiscordClient()
    this._discordClient.login()
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', keyListener)

    selectedGuildCH.callback = noCallback
    selectedChannelCH.callback = noCallback

    this._discordClient?.close()
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