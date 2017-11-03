import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PlotActions from '../../actions'

class PeptideAaSequences extends Component {

    mouseEntered = (sampleName, sequence) => {
        this.props.actions.mouseOverSequence(sampleName, sequence)
    }

    mouseLeft = () => {
        this.props.actions.mouseOverSequence(undefined, undefined)
    }

    render() {
        const { start, end, xScale, yPos, yShift, mouseOverSequence, sampleName, sampleColor, seqInfo, seq, maxShift } = this.props;

        // adapt the font size to the zoom range
        const fontSizeRatio = ((end-start) < 100) ? 100 : (end-start)
        const fontSize = 1000/fontSizeRatio

        const plotSeqRect = (seqInfo, sampleName, maxShift, sampleColor) => {

            const highlight = (bool) => {
                return {
                    height: (bool ? 2 : 0),
                    y: (bool ? 1 : 0),
                    strokeWidth: (bool ? 1 : 0.5),
                    stroke: (bool ? 'red' : sampleColor)
                }
            }

            const seq = seqInfo.sequence
            const doHighlight = mouseOverSequence && mouseOverSequence.sampleName === sampleName && mouseOverSequence.sequence === seq
            const highlightObj = highlight(doHighlight)

            return <rect
                    className="pep-aa-rect"
                    key={'pep-aa-rect' + sampleName + seq}
                    x={xScale(seqInfo.startPos - 0.5)}
                    y={yPos + maxShift * yShift - fontSize/30 - highlightObj.y}
                    width={xScale(seqInfo.endPos)-xScale(seqInfo.startPos-1)}
                    height={fontSize*0.8 + highlightObj.height}
                    fill={sampleColor}
                    stroke={highlightObj.stroke}
                    strokeWidth={highlightObj.strokeWidth}
                    onMouseEnter={() => this.mouseEntered(sampleName, seq)}
                    onMouseLeave={() => this.mouseLeft()}
                    >
                    </rect>
        }

        const plotOneSeqAa = (s, i, sampleName ,seqInfo, maxShift) => {
            return <text
                className="pep-aa"
                key={'pep-aa' + sampleName + seqInfo.sequence + i}
                fontSize={fontSize}
                x={xScale(seqInfo.startPos + (i))}
                y={yPos + maxShift * yShift}
                dominantBaseline="hanging">
                {s}
            </text>
        }

        const plotOneSeq = (seqInfo, sampleName, sampleColor, seq, maxShift) => {

            const seqAaPlots = seq.map( (s,i) => {
                return plotOneSeqAa(s, i, sampleName, seqInfo, maxShift)
            } )

            const seqRectPlot = plotSeqRect(seqInfo, sampleName, maxShift, sampleColor)

            return seqAaPlots.concat(seqRectPlot)
        }

        return (
            plotOneSeq(seqInfo, sampleName, sampleColor, seq, maxShift)
        )
    }
}

PeptideAaSequences.propTypes = {
    sampleName: PropTypes.string.isRequired,
    seqInfo: PropTypes.object.isRequired,
    seq: PropTypes.array.isRequired,
    sampleColor: PropTypes.string.isRequired,
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    maxShift: PropTypes.number.isRequired,
    yPos: PropTypes.number.isRequired,
    yShift: PropTypes.number.isRequired,
    xScale: PropTypes.func.isRequired,
    mouseOverSequence: PropTypes.object
};


function mapStateToProps(state) {
    const props = {
        mouseOverSequence: state.plotReducer.mouseOverSequence
    };

    return props;
}

function mapDispatchToProps(dispatch) {
    const actionMap = {
        actions: bindActionCreators(PlotActions, dispatch)
    };
    return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(PeptideAaSequences);