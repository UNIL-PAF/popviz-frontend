import React, {
    Component,
} from 'react';

class CopyClipboardButton extends Component {

    handleOnClick = (e) => {
            var textField = document.createElement('textarea')
            textField.value = "bli\r\n\r\n\r\nbla";

            console.log(textField.innerHTML)
            document.body.appendChild(textField)
            textField.select()
            const success = document.execCommand('copy')
            if(!success) alert('Error: Could not copy data to clipboard.')
            textField.remove()
        }

    render() {
        return (
            <g>
                <rect x={0} y={0} width={100} height={100} onClick={(e) => this.handleOnClick(e)} />
            </g>
        )
    }
}


export default CopyClipboardButton;