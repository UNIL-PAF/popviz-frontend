import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';

class CopyClipboardButton extends Component {

    objectToTableString = (data) => {
        // the selected fields
        const header = ['sampleName', 'sliceNr', 'sequence', 'aminoAcidBefore', 'aminoAcidAfter', 'startPos', 'endPos', 'molWeight', 'log2ratio']

        // separator and newlines
        const sep = "\t"
        const nlSep = "\r\n"

        // transform the data to string
        const sArr = data.map( (o) => {
            const one = header.map( (h) => {
                return o[h];
            })

            return one.join(sep)
        })

        // the header used to create the table
        var finalHeader = header
        finalHeader[7] = "log10molWeight"

        return finalHeader.join(sep) + nlSep + sArr.join(nlSep)

    }

    handleOnClick = (e) => {
            var textField = document.createElement('textarea')
            textField.value = this.objectToTableString(this.props.data)
            document.body.appendChild(textField)
            textField.select()
            const success = document.execCommand('copy')
            if(success) {
                alert('Data was copied to your clipboard.')
            }else{
                alert('Error: Could not copy data to clipboard.')
            }
            textField.remove()
        }

    render() {
        const {x, y, width, height} = this.props;

        return (
            <g>
                <rect className={'copy-clipboard-button'} x={x} y={y} width={width} height={height} onClick={(e) => this.handleOnClick(e)} />
            </g>
        )
    }
}

CopyClipboardButton.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired
}


export default CopyClipboardButton;