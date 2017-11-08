import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as _ from 'lodash';

import { ratioColorScale, sampleColor } from './colorSettings'

class Legends extends Component {


    render() {
        const { width, height, sampleSelection, mouseOverSequence } = this.props;

        const plotRatioLegendGradient = () => {
            return   <linearGradient id="ratio-gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%"  stopColor={ratioColorScale(2)}/>
                <stop offset="50%" stopColor={ratioColorScale(0)}/>
                <stop offset="100%" stopColor={ratioColorScale(-2)}/>
            </linearGradient>

        }

        const plotRatioLegendBox = (x, y, height) => {
            const width = 15

            return <g>
                <text x={x} y={y} fontFamily="sans-serif" fontSize="8px">H/L ratios (log2)</text>
                <rect fill="url(#ratio-gradient)"
                             x={x}
                             y={y+6}
                             width={width}
                             height={height}
                />
                <text x={x+width+2} y={y+10} fontFamily="sans-serif" fontSize="6px">{'>=2 (+ in Control)'}</text>
                <text x={x+width+2} y={y+8+height/2} fontFamily="sans-serif" fontSize="6px">0</text>
                <text x={x+width+2} y={y+5+height} fontFamily="sans-serif" fontSize="6px">{'<=−2 (+ in Treated)'}</text>
            </g>
        }

        const plotRatioLegend = (x, y, height) => {
            return <g>
                { plotRatioLegendGradient() }
                { plotRatioLegendBox(x, y, height) }
            </g>
        }

        const plotTheoWeightLegend = (x, y) => {
            return <g>
                <text x={x} y={y} fontFamily="sans-serif" fontSize="8px">Theo prot weight</text>
                <line
                    className="theo-prot-weight"
                    x1={x}
                    y1={y+10}
                    x2={x+30}
                    y2={y+10}
                />
            </g>
        }

        const plotOneSample = (x, y, name, desc, color, isSelected) => {
            const radius = 4

            const plotSelectedRect = () => {
                return <rect
                    x={x+1}
                    y={y-7}
                    width={65}
                    height={radius + 6}
                    stroke="red"
                    strokeWidth={0.5}
                    fill="white"
                />
            }

            return <g key={name}>
                { isSelected && plotSelectedRect()}
                <circle
                    cx={x+radius+2}
                    cy={y-radius/2}
                    r={radius}
                    fill={color}
                />
                <text x={x+12} y={y} fontFamily="sans-serif" fontSize="6px">{name + ' -'}</text>
                <text x={x+32} y={y} fontFamily="sans-serif" fontSize="6px" fontStyle="italic">{desc}</text>
            </g>

        }

        const plotSelectedSamples = (x, y, sampleSelection) => {
            const yShift = 12

            const sampleWithIdx = _.zip(sampleSelection, _.range(0, sampleSelection.length, 1))

            const samples = sampleWithIdx.filter((s) => {
                return s[0].selected;
            })

            const samplePlots = samples.map( (s, i) => {
                const isSelected = mouseOverSequence && mouseOverSequence.sampleName === s[0].sampleName
                return plotOneSample(x, y+yShift*i+13, s[0].sampleName, s[0].description, sampleColor(s[1]), isSelected)
            })

            return <g>
                <text x={x} y={y} fontFamily="sans-serif" fontSize="8px">Selected samples</text>
                { samplePlots }
            </g>

        }

        return <svg className="legends-svg" viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
                    { plotRatioLegend(0,10,50) }
                    { plotTheoWeightLegend(0, 100) }
                    { plotSelectedSamples(0, 142, sampleSelection)}
            </svg>

    }
}

Legends.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    sampleSelection: PropTypes.array.isRequired,
    mouseOverSequence: PropTypes.object
};

function mapStateToProps(state) {
    const props = {
        sampleSelection: state.plotReducer.sampleSelection,
        mouseOverSequence: state.plotReducer.mouseOverSequence
    };

    return props;
}

export default connect(mapStateToProps, null)(Legends);
