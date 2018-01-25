import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';

class AminoAcidBar extends Component {


    render() {
        const { sequence, zoomLeft, zoomRight, xScale, yPos } = this.props;

        // the sequence to plot
        const [start, end] = [Math.floor(zoomLeft), Math.floor(zoomRight)]
        const subSeq = sequence.substring(start, end).split('')

        // adapt the font size to the zoom range
        const fontSizeRatio = (subSeq.length < 100) ? 100 : subSeq.length
        const fontSize = 1000/ fontSizeRatio

        const plotAaBar = () => {
            return subSeq.map( (s,i) => {
                return <text className="aa-bar" key={i} fontSize={fontSize} x={xScale(start + (i+1))} y={yPos} textAnchor="middle" alignmentBaseline="hanging">{s}</text>
            } )
        }

        return (
            plotAaBar()
        )

    }
}

AminoAcidBar.propTypes = {
    zoomLeft: PropTypes.number.isRequired,
    zoomRight: PropTypes.number.isRequired,
    xScale: PropTypes.func.isRequired,
    sequence: PropTypes.string.isRequired
};

export default (AminoAcidBar);