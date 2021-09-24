import { Component, memo } from 'react'

export default class MainPage extends Component {
    render() {
        return (
            <>
            <div style={{ width: '100%', height: 8 }}/>
            <MenuItem selected={false} text='Friends' viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="currentColor" fill-rule="nonzero" d="M0.5,0 L0.5,1.5 C0.5,5.65 2.71,9.28 6,11.3 L6,16 L21,16 L21,14 C21,11.34 15.67,10 13,10 C13,10 12.83,10 12.75,10 C8,10 4,6 4,1.5 L4,0 L0.5,0 Z M13,0 C10.790861,0 9,1.790861 9,4 C9,6.209139 10.790861,8 13,8 C15.209139,8 17,6.209139 17,4 C17,1.790861 15.209139,0 13,0 Z" transform="translate(2 4)"></path><path d="M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z"></path></g></MenuItem>
            <MenuItem selected text='Library' viewBox="0 0 24 24"/>
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
                        {this.props.children === undefined ? librarySvg(bgc) : this.props.children}
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

const librarySvg = (bgc: string) => (
    <>
    <rect fill="currentColor" height="22.5" id="svg_1" rx="3" ry="3" stroke={bgc} stroke-width="0" width="21" x="1.5" y="1.25"/>
    <rect fill="currentColor" height="12" id="svg_2" rx="3" ry="3" stroke={bgc} stroke-width="2" width="20" x="2" y="1"/>
    <line fill="none" id="svg_3" stroke={bgc} stroke-width="2" x1="8" x2="8" y1="10.041899" y2="16.030807"/>
    <line fill="none" id="svg_4" stroke={bgc} stroke-width="2" x1="16" x2="16" y1="10.035737" y2="16.024645"/>
    <line fill="none" id="svg_5" stroke={bgc} stroke-width="2" x1="8" x2="8" y1="17.55268" y2="19.530807"/>
    <line fill="none" id="svg_6" stroke={bgc} stroke-width="2" x1="16" x2="16" y1="17.528036" y2="19.5"/>
    </>
)