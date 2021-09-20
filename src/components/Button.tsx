import { Component, CSSProperties } from 'react'

type ButtonProps = {
    style?: CSSProperties,
    //hover?: (over: boolean, ref: Button) => void,
    hoverStyle?: CSSProperties,
    activeStyle?: CSSProperties,

    onClick?: ButtonClickListener,
    onHover?: ButtonHoverListener,

    toggle?: boolean,
    active?: boolean,
}

type ButtonState = {
    over: boolean,
    active: boolean
}

export type ButtonClickListener = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, ref: Button) => void
export type ButtonHoverListener = (over: boolean, ref: Button) => void

export default class Button extends Component<ButtonProps, ButtonState> {
    constructor(props: ButtonProps) {
        super(props);
        this.state = {
            over: false,
            active: props.active ?? false
        }
    }

    _currentHoverStyle: CSSProperties | undefined
    _currentActiveStyle: CSSProperties | undefined

    render() {
        return (
            <div 
            style={{
                cursor: 'pointer',
                ...this.props.style,
                ...this._currentHoverStyle,
                ...this._currentActiveStyle
            }}
            onMouseEnter={() => {
                this._currentHoverStyle = this.props.hoverStyle
                this.setState({ over: true })
                this.props.onHover?.(true, this)
            }}
            onMouseLeave={() => {
                this._currentHoverStyle = undefined
                this.setState({ over: false })
                this.props.onHover?.(false, this)
            }}
            onMouseDown={() => {
                const active = this.props.toggle ? !this.state.active : true
                this._currentActiveStyle = active ? this.props.activeStyle : undefined
                this.setState({ active: active })
            }}
            onMouseUp={() => {
                if (!this.props.toggle) {
                    this._currentActiveStyle = undefined
                    this.setState({ active: false })
                }
            }}
            onClick={(e) => {
                this.props.onClick?.(e, this)
            }}
            >
                {this.props.children}
            </div>
        )
    }
}
