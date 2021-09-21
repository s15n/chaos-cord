import { Component } from "react";
import { CallbackHandler } from "../Callback";
import { DiscordGuild } from "../discord/discord-classes";

const guildsCallback: CallbackHandler<DiscordGuild[]> = {
    callback: guilds => {}
}

export default class Guilds extends Component {
    render() {
        return (
            <nav id='Guilds' style={{ //className='full-height'
                height: '100%',
                width: 72,
            }}>
                Guilds
            </nav>
        )
    }
}