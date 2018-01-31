import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';

class CopyClipboardButton extends Component {

    objectToTableString = (data) => {

        console.log(data)

        // the selected fields
        const header = ['sampleName', 'sliceNr', 'sequence', 'aminoAcidBefore', 'aminoAcidAfter', 'startPos', 'endPos', 'log2ratio', 'molWeight', 'molWeight', 'ratioCount']

        // separator and newlines
        const sep = "\t"
        const nlSep = "\r\n"

        // transform the data to string
        const sArr = data.map( (o) => {
            var one = header.map( (h) => {
                return o[h];
            })
            // compute MolWeigth in kDa
            one[9] = Math.pow(10, one[9])

            return one.join(sep)
        })

        // the header used to create the table
        var finalHeader = header
        finalHeader[7] = "H.L.ratio.log2"
        finalHeader[8] = "molWeight.log10"
        finalHeader[9] = "molWeight.kDa"
        finalHeader[10] = "H.L.ratio.count"

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
        const {x, y, width, height, text} = this.props;

        return (
            <g>
                <rect className={'copy-clipboard-button'} x={x} y={y} width={width} height={height} onClick={(e) => this.handleOnClick(e)} />
                <text
                    className="copy-clipboard-button-text"
                    x={(x+5)}
                    y={(y+8)}
                    fontFamily="Helvetica"
                    fontSize="8px"
                >
                    {text}
                </text>
            </g>
        )
    }
}

CopyClipboardButton.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
    text: PropTypes.string.isRequired
}


export default CopyClipboardButton;