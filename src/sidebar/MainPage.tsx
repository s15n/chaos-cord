import { Component, memo } from 'react'

export default class MainPage extends Component {
    render() {
        return (
            <>
            <div style={{ width: '100%', height: 8 }}/>
            <MenuItem selected={false} text='Friends' viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="currentColor" fill-rule="nonzero" d="M0.5,0 L0.5,1.5 C0.5,5.65 2.71,9.28 6,11.3 L6,16 L21,16 L21,14 C21,11.34 15.67,10 13,10 C13,10 12.83,10 12.75,10 C8,10 4,6 4,1.5 L4,0 L0.5,0 Z M13,0 C10.790861,0 9,1.790861 9,4 C9,6.209139 10.790861,8 13,8 C15.209139,8 17,6.209139 17,4 C17,1.790861 15.209139,0 13,0 Z" transform="translate(2 4)"></path><path d="M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z"></path></g></MenuItem>
            <MenuItem selected text='Library' viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="currentColor" d="M17,13.6 L17.3999992,13.6 C19.0406735,13.6 20.496781,12.8097754 21.4084757,11.5891722 L21.8198761,18.8298199 C21.913864,20.4840062 20.6490733,21.9011814 18.994887,21.9951692 C18.9382174,21.9983891 18.8814679,22 18.8247069,22 L5.1752931,22 C3.51843885,22 2.1752931,20.6568542 2.1752931,19 C2.1752931,18.943239 2.17690401,18.8864895 2.18012387,18.8298199 L2.59152425,11.5891732 C3.503219,12.8097758 4.95932613,13.6 6.6,13.6 L7,13.6 L7,15 L9,15 L9,13.6 L15,13.6 L15,15 L17,15 L17,13.6 Z M7,16 L7,18 L9,18 L9,16 L7,16 Z M15,16 L17,16 L17,18 L15,18 L15,16 Z M15,11.6 L9,11.6 L9,9 L7,9 L7,11.6 L6.6,11.6 C4.94314575,11.6 3.6,10.2568542 3.6,8.6 L3.6,5 C3.6,3.34314575 4.94314575,2 6.6,2 L17.3999992,2 C19.0568535,2 20.3999992,3.34314575 20.3999992,5 L20.3999992,8.6 C20.3999992,10.2568542 19.0568535,11.6 17.3999992,11.6 L17,11.6 L17,9 L15,9 L15,11.6 Z"></path></g></MenuItem>
            </>
        )
    }
}

type MenuItemProps = {
    selected: boolean
    text: string
    viewBox: string
    children?: any
}

type MenuItemState = {
    hover: boolean
}

class MenuItem extends Component<MenuItemProps, MenuItemState> {
    constructor(props: MenuItemProps) {
        super(props)
        this.state = {
            hover: false
        }
    }

    render() {
        const bgc = this.props.selected ? '#3f3f3f' : this.state.hover ? '#2f2f2f' : '#222222'
        return (
            <div
            style={{
                marginLeft: 8,
                paddingTop: 1,
                paddingBottom: 1,
                height: 42,
                width: 224,
                cursor: 'pointer'
            }}
            onMouseEnter={() => this.setState({ hover: true })}
            onMouseLeave={() => this.setState({ hover: false })}
            >
                <div style={{
                    paddingLeft: 8,
                    paddingRight: 8,
                    height: 42,
                    width: 208,
                    backgroundColor: bgc,
                    borderRadius: 5,
                    color: '#eeeeee'
                }}>
                    <svg style={{
                        width: 24,
                        height: 24,
                        marginRight: 12,
                        marginTop: 9,
                        float: 'left',
                    }} width="24" height="24" viewBox={this.props.viewBox}>
                        {this.props.children}
                    </svg>
                    <div style={{
                        width: 164,
                        height: 20,
                        marginTop: 9,
                        display: 'inline-block',
                        fontWeight: 500
                    }}>
                        {this.props.text}
                    </div>
                </div>
            </div>
        )
    }
}