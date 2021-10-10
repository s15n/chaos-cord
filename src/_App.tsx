import isElectron from 'is-electron'
import React from 'react';
import { DiscordGuild } from './discord/classes/DiscordGuild';
import { DiscordChannelBase } from './discord/discord-classes';
import { DiscordVoiceState } from './discord/voice/DiscordVoice';

import './App.css'
import { DiscordClient } from './discord/DiscordClient';
import Guilds from './guildsbar/_Guilds';
import Sidebar from './sidebar/_Sidebar';

const keyListener = (e: KeyboardEvent) => {
    if (e.code === 'KeyR' && e.ctrlKey) window.electron.reloadPage()
    else if (e.code === 'KeyI' && e.ctrlKey && e.shiftKey) window.electron.devTools()
}

window.addEventListener('keypress', keyListener)


export const DiscordClientContext = React.createContext<DiscordClient | null>(null)


interface DiscordStateContextHandler {
    guild: DiscordGuild | null
    channel: DiscordChannelBase | null
    voice: DiscordVoiceState | null

    setGuild(guild: DiscordGuild | null): void
    setChannel(channel: DiscordChannelBase | null): void
    setVoice(channel: DiscordVoiceState | null): void
}

export const DiscordStateContext = React.createContext<DiscordStateContextHandler>({
    guild: null,
    channel: null,
    voice: null,
    setGuild: () => {},
    setChannel: () => {},
    setVoice: () => {}
});


const App: React.FC = () => {
    const [client, setClient] = React.useState<DiscordClient | null>(null)

    const [selectedGuild, selectGuild] = React.useState<DiscordGuild | null>(null)
    const [selectedChannel, selectChannel] = React.useState<DiscordChannelBase | null>(null)
    const [currentVoice, setVoice] = React.useState<DiscordVoiceState | null>(null)

    React.useEffect(() => {
        let token = window.localStorage.getItem('token')
        if (!token) {
            token = 'ODg3MzM4OTU4NDUzODY2NTU3.YUCs2A.XZz40Vz7W5foc3vYrrhG0Zhs6ts'
            window.localStorage.setItem('token', token)
        }
        const client = new DiscordClient(token)
        setClient(client)
        client.login()

        console.log('Login')

        return () => {
            client.close()
            setClient(null)
        }
    }, [])

    return (
        <DiscordClientContext.Provider value={client}>
            <DiscordStateContext.Provider value={{
                guild: selectedGuild,
                channel: selectedChannel,
                voice: currentVoice,
                setGuild: selectGuild,
                setChannel: selectChannel,
                setVoice: setVoice
            }}>
                <div className="full-size">
                    {isElectron() ? <AppBar/> : null}
                    <div id="app-root">
                        <Guilds/>
                        <Sidebar/>
                        <ChatContainer/>
                    </div>
                </div>
            </DiscordStateContext.Provider>
        </DiscordClientContext.Provider>
    )
}

const AppBar: React.FC = () => {
    return (
        <div id='app-bar'>
            <div className='flex-grow drag'>
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
}

interface AppBarIconProps {
    action: 'minimize' | 'maximize' | 'close'
}

const AppBarIcon: React.FC<AppBarIconProps> = ({ action, children }) => {
    function windowButtonClicked() {
        window.electron.windowButton(action)
    }

    return (
        <button className={action === 'close' ? 'app-bar-icon app-bar-icon-close' : 'app-bar-icon'} onClick={windowButtonClicked}>
            {children}
        </button>
    )
}

export default App


function ChatContainer() {
    return (<div></div>)
}