import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash'
import { connect } from 'react-redux';
import * as ControlActions from '../../actions'
import { bindActionCreators } from 'redux';

const defaultRemoveCrossColor = "grey"
const defaultRemoveRectColor = "white"

class PeptidePopOver extends Component {

    constructor(props) {
        super(props)

        this.state = {
            removeCrossColor: defaultRemoveCrossColor,
            removeRectColor: defaultRemoveRectColor
        }
    }

    onRemoveEnter = () => {
        this.setState({
            removeCrossColor: "white",
            removeRectColor: "red"
        })
    }

    onRemoveLeave = () => {
        this.setState({
            removeCrossColor: defaultRemoveCrossColor,
            removeRectColor: defaultRemoveRectColor
        })
    }

    render() {
        const {popOverInfo, removable, limitRight} = this.props;
        const textShiftY = 9;
        const textShiftX = 60;
        const popupShiftX = -10;
        const popupShiftY = -20;

        var [x,y] = [popOverInfo.x + popupShiftX, popOverInfo.y + popupShiftY]

        const seqLengthCorr = (popOverInfo.pepInfo.sequence.length > 10) ? (popOverInfo.pepInfo.sequence.length - 10) * 5 : 0;

        const width = 150 + seqLengthCorr

        // if the popover lies outside the plot area, we place it left of the mouse position
        if(x+width > limitRight)x = x-width-50
        if(y < 0) y = 0



        const infoToSvgText = (pepInfo, x,y) => {
            var i=1;

            const plotInfoObj = {
                'Sample': pepInfo.sampleName,
                'Sequence': pepInfo.aminoAcidBefore + '.' + pepInfo.sequence + '.' + pepInfo.aminoAcidAfter,
                'Start pos': pepInfo.startPos,
                'End pos': pepInfo.endPos,
                'Mol weight': Math.pow(10, pepInfo.molWeight).toFixed(2) + ' kDa',
                'H/L Ratio (log2)': pepInfo.log2ratio.toFixed(2),
                'Count': pepInfo.ratioCount
            }

            return _.map(plotInfoObj, (v,k) => {
                const title = <text
                            className="peptide-pop-over-title"
                            x={(x+5)}
                            y={(y+i*textShiftY+5)}
                            fontFamily="Helvetica"
                            fontSize="8px"
                        >
                        {k}
                    </text>

                const text = <text
                            className="peptide-pop-over-value"
                            x={(x + textShiftX + 5)}
                            y={(y+i*textShiftY+5)}
                            fontFamily="Helvetica"
                            fontSize="8px"
                       >
                            {v}
                       </text>

                i = i + 1

                return <g key={i}>{title}{text}</g>

            })
        }

        const plotRemoveButton = () => {
            const thisWidth = 3
            const thisHeight = 3
            const thisX = (x+144+seqLengthCorr-thisWidth)
            const thisY = (y+8-thisHeight)

            return <g
                className="peptide-pop-over-close"
                onClick={() => this.props.actions.removePopover(popOverInfo.id) }
                onMouseEnter={ () => this.onRemoveEnter()}
                onMouseLeave={ () => this.onRemoveLeave()}
            >
                <circle
                    cx={thisX + thisWidth/2}
                    cy={thisY + thisHeight/2}
                    r={thisWidth+0.5}
                    fill={this.state.removeRectColor}
                    fillOpacity={0.9}
                />

                <line
                    x1={thisX}
                    y1={thisY}
                    x2={thisX+thisWidth}
                    y2={thisY+thisHeight}
                    stroke={this.state.removeCrossColor}
                    strokeLinecap="round"
                />

                <line
                    x1={thisX+thisWidth}
                    y1={thisY}
                    x2={thisX}
                    y2={thisY+thisHeight}
                    stroke={this.state.removeCrossColor}
                    strokeLinecap="round"
                />

            </g>
        }

        return (
            <g>
                <rect
                    className="peptide-pop-over"
                    x={x}
                    y={y}
                    rx="5"
                    ry="5"
                    width={width}
                    height="80" />
                {infoToSvgText(popOverInfo.pepInfo, x, y+3)}
                { removable && plotRemoveButton()}
            </g>
        )

    }
}

PeptidePopOver.propTypes = {
    popOverInfo: PropTypes.object.isRequired,
    removable: PropTypes.bool,
    limitRight: PropTypes.number.isRequired
};


function mapDispatchToProps(dispatch) {
    const actionMap = {
        actions: bindActionCreators(ControlActions, dispatch)
    };
    return actionMap;
}

export default connect(null, mapDispatchToProps)(PeptidePopOver);