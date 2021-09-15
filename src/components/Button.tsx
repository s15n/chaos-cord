import { Component, CSSProperties } from 'react'

type ButtonProps = { 
    style?: CSSProperties | undefined,
    //hover?: (over: boolean, ref: Button) => void,
    baseColor: any,
    overColor: any,
    activeColor: any,
    onClick?: ButtonClickListener,
    toggle?: boolean,
    active?: boolean,
}

type ButtonState = {
    over: boolean,
    active: boolean
}

export type ButtonClickListener = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, ref: Button) => void

export default class Button extends Component<ButtonProps, ButtonState> {
    constructor(props: ButtonProps) {
        super(props);
        this.state = {
            over: false,
            active: props.active ?? false
        }
    }

    render() {
        return (
            <div 
            style={{
                cursor: 'pointer',
                ...this.props.style,
                color: this.state.active ? this.props.activeColor : this.state.over ? this.props.overColor : this.props.baseColor
            }}
            onMouseEnter={() => {
                this.setState({ over: true })
            }}
            onMouseLeave={() => {
                this.setState({ over: false })
            }}
            onMouseDown={() => {
                this.setState({ active: this.props.toggle ? !this.state.active : true })
            }}
            onMouseUp={() => {
                if (!this.props.toggle) this.setState({ active: false })
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
