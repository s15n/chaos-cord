import { Component, CSSProperties } from 'react'

type TextInputProps = {
    placeholder?: string,
    style?: CSSProperties | undefined,
}

type TextInputState = {
    focused: boolean
    text: string
}

export default class TextInput extends Component<TextInputProps, TextInputState> {
    constructor(props: TextInputProps) {
        super(props)
        this.state = {
            focused: false,
            text: ''
        }
    }

    readonly _textColor = this.props.style?.color?.toString() ?? '#f2f2f2'
    readonly _textColorPlaceholder = this._textColor+'7f'

    render() {
        return (
            <div style={{
                cursor: 'text',
                ...this.props.style
            }}>
                <span onClick={() => this.setState({focused: true})} style={{
                    position: 'absolute',
                    paddingLeft: 2,
                    paddingRight: 2,
                    color: this.state.text.length === 0 ? this._textColorPlaceholder : this._textColor
                }}>
                    {this.props.placeholder}
                </span>
            </div>
        )
    }
}
