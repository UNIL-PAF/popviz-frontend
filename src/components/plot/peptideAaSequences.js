import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import { schemeCategory20 } from 'd3-scale';
import * as _ from 'lodash';

class PeptideAaSequences extends Component {

    render() {
        const { peptideSequences, selectedSamples, zoomLeft, zoomRight, xScale, yPos, yShift, sampleSelection } = this.props;

        // the sequence to plot
        const [start, end] = [Math.floor(zoomLeft), Math.floor(zoomRight)]

        // we take first the light colors from "schemeCategory20" and afterwards the darker ones
        const colorSchemeArray = _.range(1, 20, 2).concat(_.range(0, 19, 2))

        // create an array with entries for every AA position
        var aaShiftArray = []

        // adapt the font size to the zoom range
        const fontSizeRatio = ((end-start) < 100) ? 100 : (end-start)
        const fontSize = 1000/fontSizeRatio

        const plotSeqRect = (seqInfo, sampleName, maxShift, sampleColor) => {
            return <rect
                    className="pep-aa-rect"
                    key={sampleName + seqInfo.sequence}
                    x={xScale(seqInfo.startPos - 0.5)}
                    y={yPos + maxShift * yShift - 0.5}
                    width={xScale(seqInfo.endPos)-xScale(seqInfo.startPos-1)}
                    height={fontSize*0.8}
                    fill={sampleColor}
                    stroke={sampleColor}
                    >
                    </rect>
        }

        const plotOneSeqAa = (s, i, sampleName ,seqInfo, maxShift) => {
            return <text
                className="pep-aa"
                key={sampleName + seqInfo.sequence + i}
                fontSize={fontSize}
                x={xScale(seqInfo.startPos + (i))}
                y={yPos + maxShift * yShift}
                textAnchor="middle"
                alignmentBaseline="hanging">
                {s}
            </text>
        }

        const plotOneSeq = (seqInfo, sampleName, sampleColor) => {

            const seq = seqInfo.sequence.split('')

            // find shift and update the array
            var maxShift = 0
            for(var i=0; i<seq.length; i++){
                const pos = seqInfo.startPos + i - start
                const posVal = aaShiftArray[pos] ? aaShiftArray[pos] : 0
                if(posVal > maxShift) maxShift = posVal
                const posShift = posVal + 1
                aaShiftArray[pos] = posShift
            }

            const seqAaPlots = seq.map( (s,i) => {
                return plotOneSeqAa(s, i, sampleName, seqInfo, maxShift)
            } )

            const seqRectPlot = plotSeqRect(seqInfo, sampleName, maxShift, sampleColor)

            return seqAaPlots.concat(seqRectPlot)
        }

        const plotOneSample = (sampleName) => {

            const sampleIdx = _.findIndex(sampleSelection, (s) => { return s.sampleName === sampleName; })
            const sampleColor = schemeCategory20[colorSchemeArray[sampleIdx]]

            // keep only sequences within the zoom range
            const seqs = peptideSequences[sampleName].peptideSequences

            const fltSeqs = seqs.filter((s) => {
                return (s.startPos > zoomLeft && s.startPos < zoomRight) || (s.endPos < zoomRight && s.endPos > zoomLeft)
            })

            return _.flatMap(fltSeqs, (s) => {
                return plotOneSeq(s, sampleName, sampleColor)
            })
        }

        const plotAaBar = () => {
            // loop through the selected samples
            return _.flatMap(selectedSamples, (s) => plotOneSample(s))
        }

        return (
            plotAaBar()
        )
    }
}

PeptideAaSequences.propTypes = {
    zoomLeft: PropTypes.number.isRequired,
    zoomRight: PropTypes.number.isRequired,
    yPos: PropTypes.number.isRequired,
    yShift: PropTypes.number.isRequired,
    xScale: PropTypes.func.isRequired,
    peptideSequences: PropTypes.object.isRequired,
    selectedSamples: PropTypes.array.isRequired,
    sampleSelection: PropTypes.array.isRequired
};

export default (PeptideAaSequences);