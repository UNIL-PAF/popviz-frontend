import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';

class AminoAcidBar extends Component {


    render() {
        const { sequence, zoomLeft, zoomRight, xScale, yPos, xPos, xAxisLengthPx, viewBoxRatioX } = this.props;

        // the sequence to plot
        const [start, end] = [Math.floor(zoomLeft), Math.floor(zoomRight)]
        const subSeq = sequence.substring(start, end).split('')

        console.log(start + ':' + end)
        console.log('subSeq: ' + subSeq)

        console.log(xScale(end)-xScale(start))
        console.log(end -start)

        const fontSize = xAxisLengthPx / subSeq.length / 2
        //const letterSpacing = viewBoxRatioX * (xScale(2) - xScale(1)) - fontSize
        const letterSpacing = fontSize//((start-end) - (fontSize * subSeq.length)) / subSeq.length

        console.log('fontSize: ' + fontSize)
        console.log('letterSpacing: ' + letterSpacing)

        return (
            <text className="aa-bar" fontSize={(fontSize * 1.638)+'px'} x={xScale(zoomLeft)} y={yPos} letterSpacing={letterSpacing+'px'}>{subSeq}</text>
        )

    }
}

AminoAcidBar.propTypes = {
    zoomLeft: PropTypes.number,
    zoomRight: PropTypes.number,
    yPos: PropTypes.number,
    xPos: PropTypes.number,
    xAxisLengthPx: PropTypes.number,
    viewBoxRatioX: PropTypes.number,
    xScale: PropTypes.func.isRequired,
    sequence: PropTypes.string.isRequired
};

export default (AminoAcidBar);