import { Component } from 'react'
import { CallbackHandler, noCallback } from '../Callback'
import Header from './Header';

const memberListHandler: CallbackHandler<boolean> = {
    callback: noCallback
}

export function setMemberListVisible(visible: boolean) {
    memberListHandler.callback(visible);
}

export default class ChatContainer extends Component<{}, {
    memberListVisible: boolean
}> {
    constructor(props: {}) {
        super(props);
        this.state = {
            memberListVisible: true
        }
    }

    componentDidMount() {
        memberListHandler.callback = visible => this.setState({
            memberListVisible: visible
        })
    }

    componentWillUnmount() {
        memberListHandler.callback = noCallback;
    }

    render() {
        return (
            <div id='ChatContainer' className='full-height column'>
                <Header channelName='text'/>
                <div className='row'>
                    <div/>
                    {this.state.memberListVisible ? <div/> : null}
                </div>
            </div>
        )
    }
}