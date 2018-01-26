import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash'

const defaultRemoveCrossColor = "grey"
const defaultRemoveRectColor = "white"

class PopOverSkeleton extends Component {

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
        const {x, y, width, height, content, onCloseCb, removable, contentId, colSpace} = this.props;

        const textShiftY = 9;
        const textShiftX = colSpace || 60;

        const infoToSvgText = (content, x,y) => {
            var i=1;

            return _.map(content, (v,k) => {
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
            const thisWidth = 5
            const thisHeight = 5
            const thisX = (x+width-thisWidth-6)
            const thisY = (y+10-thisHeight)

            return <g
                className="peptide-pop-over-close"
                onClick={ () => onCloseCb(contentId) }
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
                    height={height} />
                {infoToSvgText(content, x, y+3)}
                { removable && plotRemoveButton()}
            </g>
        )

    }
}

PopOverSkeleton.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    removable: PropTypes.bool,
    content: PropTypes.object.isRequired,
    onCloseCb: PropTypes.func,
    contentId: PropTypes.string,
    colSpace: PropTypes.number
};

export default PopOverSkeleton;