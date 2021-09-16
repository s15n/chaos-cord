import { Component } from 'react';
import './App.css';
import Sidebar from './sidebar/Sidebar';
import Guilds from './guildsbar/Guilds';
import ChatContainer from './chat/ChatContainer';
import { discordClose, discordLogin } from './discord/DiscordMain';

export default class App extends Component {
  componentDidMount() {
    discordLogin()
  }

  componentWillUnmount() {
    discordClose()
  }

  render() {
    return (
      <div className='full-size row'>
        <Guilds/>
        <Sidebar/>
        <ChatContainer/>
      </div>
    )
  }
}