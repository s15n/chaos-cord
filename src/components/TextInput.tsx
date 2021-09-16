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
            <div style={this.props.style}>
                {this.props.children}
            </div>
        )
    }
}
