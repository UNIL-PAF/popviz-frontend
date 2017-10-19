import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as _ from 'lodash'


class PeptidePopOver extends Component {

    render() {
        const {mouseOverPepInfo, mouseOverPepPos} = this.props;
        const textShiftY = 6;
        const textShiftX = 40;
        const popupShiftX = 20;
        const popupShiftY = -10;

        const [x,y] = mouseOverPepPos

        const seqLengthCorr = (mouseOverPepInfo.sequence.length > 10) ? (mouseOverPepInfo.sequence.length - 10) * 3 : 0;

        const infoToSvgText = (pepInfo, x,y) => {
            var i=1;

            const plotInfoObj = {
                'Sample': pepInfo.sampleName,
                'Sequence': pepInfo.aminoAcidBefore + '.' + pepInfo.sequence + '.' + pepInfo.aminoAcidAfter,
                'Mol weight': pepInfo.molWeight,
                'H/L Ratio (log2)': pepInfo.log2ratio,
                'Count': pepInfo.ratioCount
            }

            return _.map(plotInfoObj, (v,k) => {
                const title = <text
                            className="peptide-pop-over-title"
                            x={x+popupShiftX+5}
                            y={y+i*textShiftY+popupShiftY+5}
                            fontFamily="Helvetica"
                            fontSize="5"
                        >
                        {k}
                    </text>

                const text = <text
                            className="peptide-pop-over-value"
                            x={x+popupShiftX + textShiftX + 5}
                            y={y+i*textShiftY+popupShiftY+5}
                            fontFamily="Helvetica"
                            fontSize="5"
                       >
                            {v}
                       </text>

                i = i + 1

                return <g key={i}>{title}{text}</g>

            })
        }

        return (
            <g>
                <rect className="peptide-pop-over" x={x+popupShiftX} y={y+popupShiftY} width={100 + seqLengthCorr} height="40" />
                {infoToSvgText(mouseOverPepInfo, x, y)}
            </g>
    )

    }
}

PeptidePopOver.propTypes = {
    mouseOverPepInfo: PropTypes.object.isRequired,
    mouseOverPepPos: PropTypes.array.isRequired
};

function mapStateToProps(state) {
    const props = {
        //mouseOverPepInfo: state.plotReducer.mouseOverPepInfo
    };

    return props;
}


export default connect(mapStateToProps)(PeptidePopOver);