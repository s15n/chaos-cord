import { Component } from 'react';
import './App.css';
import Sidebar from './sidebar/Sidebar';
import Guilds from './guildsbar/Guilds';
import ChatContainer from './chat/ChatContainer';

export default class App extends Component {
  componentDidMount() {
    // discord login
  }

  componentWillUnmount() {
    // discord close
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