import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash'
import { connect } from 'react-redux';
import * as ControlActions from '../../actions'
import { bindActionCreators } from 'redux';

const defaultRemoveCrossColor = "grey"

class PeptidePopOver extends Component {



    constructor(props) {
        super(props)

        this.state = {
            removeCrossColor: defaultRemoveCrossColor
        }
    }

    onRemoveEnter = () => {
        this.setState({removeCrossColor: "red"})
    }

    onRemoveLeave = () => {
        this.setState({removeCrossColor: defaultRemoveCrossColor})
    }

    render() {
        const {popOverInfo, removable} = this.props;
        const textShiftY = 6;
        const textShiftX = 40;
        const popupShiftX = 20;
        const popupShiftY = -20;

        const [x,y] = [popOverInfo.x, popOverInfo.y]

        const seqLengthCorr = (popOverInfo.pepInfo.sequence.length > 10) ? (popOverInfo.pepInfo.sequence.length - 10) * 3 : 0;

        const infoToSvgText = (pepInfo, x,y) => {
            var i=1;

            const plotInfoObj = {
                'Sample': pepInfo.sampleName,
                'Sequence': pepInfo.aminoAcidBefore + '.' + pepInfo.sequence + '.' + pepInfo.aminoAcidAfter,
                'Start pos': pepInfo.startPos,
                'End pos': pepInfo.endPos,
                'Mol weight': pepInfo.molWeight,
                'H/L Ratio (log2)': pepInfo.log2ratio,
                'Count': pepInfo.ratioCount
            }

            return _.map(plotInfoObj, (v,k) => {
                const title = <text
                            className="peptide-pop-over-title"
                            x={(x+popupShiftX+5)}
                            y={(y+i*textShiftY+popupShiftY+5)}
                            fontFamily="Helvetica"
                            fontSize="5"
                        >
                        {k}
                    </text>

                const text = <text
                            className="peptide-pop-over-value"
                            x={(x+popupShiftX + textShiftX + 5)}
                            y={(y+i*textShiftY+popupShiftY+5)}
                            fontFamily="Helvetica"
                            fontSize="5"
                       >
                            {v}
                       </text>

                i = i + 1

                return <g key={i}>{title}{text}</g>

            })
        }

        const plotRemoveButton = () => {
            const thisWidth = 5
            const thisHeight = 5
            const thisX = (x+popupShiftX+97+seqLengthCorr-thisWidth)
            const thisY = (y+popupShiftY+8-thisHeight)

            return <g
                className="peptide-pop-over-close"
                onClick={() => this.props.actions.removePopover(popOverInfo.id) }
                cursor="pointer"
                onMouseEnter={ () => this.onRemoveEnter()}
                onMouseLeave={ () => this.onRemoveLeave()}
            >
                <rect
                    x={thisX}
                    y={thisY}
                    width={thisWidth}
                    height={thisHeight}
                    fill="white"
                    fillOpacity={0.9}
                />

                <line
                    x1={thisX}
                    y1={thisY}
                    x2={thisX+thisWidth}
                    y2={thisY+thisHeight}
                    stroke={this.state.removeCrossColor}
                />

                <line
                    x1={thisX+thisWidth}
                    y1={thisY}
                    x2={thisX}
                    y2={thisY+thisHeight}
                    stroke={this.state.removeCrossColor}
                />

            </g>
        }

        return (
            <g>
                <rect
                    className="peptide-pop-over"
                    x={(x+popupShiftX)}
                    y={(y+popupShiftY)}
                    rx="5"
                    ry="5"
                    width={100 + seqLengthCorr}
                    height="60" />
                {infoToSvgText(popOverInfo.pepInfo, x, y)}
                { removable && plotRemoveButton()}
            </g>
        )

    }
}

PeptidePopOver.propTypes = {
    popOverInfo: PropTypes.object.isRequired,
    removable: PropTypes.bool
};


function mapDispatchToProps(dispatch) {
    const actionMap = {
        actions: bindActionCreators(ControlActions, dispatch)
    };
    return actionMap;
}

export default connect(null, mapDispatchToProps)(PeptidePopOver);