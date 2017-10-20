import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { brushX } from 'd3-brush';
import * as d3 from 'd3';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ControlActions from '../../actions'
import Peptide from './peptide'
import PeptidePopOver from './peptidePopOver'

class SliceSilacPlot extends Component {

    constructor(props) {
        super(props)

        this.state = {
            xScale: scaleLinear().range([0, this.props.width]),
            yScale: scaleLinear().range([this.props.height, 0]),
            colorScale: scaleLinear().domain([2,-2]).range([0,1])
        }
    }

    brushend = () => {
        var s = d3.event.selection;
        if(s){
            const newDomain = s.map(this.state.xScale.invert, this.state.xScale);
            this.props.actions.changeZoomRange(newDomain[0], newDomain[1]);

            // remove the brush area
            this.mainG.call(brushX().move, null)
        }
    }

    componentDidMount(){
        setTimeout(() => this.mainG.call(brushX(this.state.xScale).on('end', this.brushend)))
    }

    zoomOut = () => {
        const {width} = this.props;
        this.props.actions.changeZoomRange(1, width);
    }

    render() {
        const {width, height, zoomLeft, zoomRight, protein, filteredPepList, mouseOverPepId, mouseOverPepInfo, mouseOverPepPos, sampleSelection} = this.props;


        // create the array containing the peptide plot elements
        const plotPeptides = (selectedPeps, thisZoomLeft, thisZoomRight, selectedSamples) => {
            const nrSelectedSamples = selectedSamples.length

            return selectedPeps.map((p,i) => {
                return <Peptide
                    zoomLeft={thisZoomLeft}
                    zoomRight={thisZoomRight}
                    xScale={this.state.xScale}
                    yScale={this.state.yScale}
                    colorScale={this.state.colorScale}
                    pepInfo={p}
                    mouseIsOver={p.id === mouseOverPepId}
                    samplePos={selectedSamples.indexOf(p.sampleName)}
                    nrSamples={nrSelectedSamples}
                    svgParent={this.svg}
                    key={i}
                />
            })
        }

        // create the plot area
        const plotContentGenerator = () => {
            const thisZoomLeft = (zoomLeft === undefined) ? 1 : zoomLeft;
            const thisZoomRight = (zoomRight === undefined) ? protein.sequenceLength : zoomRight;

            this.state.xScale.domain([thisZoomLeft, thisZoomRight]);
            this.state.yScale.domain([protein.minMolWeight, protein.maxMolWeight]);

            // create array of selected samples
            const selectedSamples = sampleSelection.filter((ss) => {
                return ss.selected;
            }).map((ss) => {
                return ss.sampleName
            })

            // construct and concat the different elements of the plot
            var finalPlotList = plotPeptides(filteredPepList, thisZoomLeft, thisZoomRight, selectedSamples)


            return finalPlotList
        }

        // create popover when mouse is over a peptide
        const plotPopover = () => {
                return <PeptidePopOver
                    mouseOverPepInfo={mouseOverPepInfo}
                    mouseOverPepPos={mouseOverPepPos}
                />
        }

        return (
            <div>
            <svg className="slice-silac-svg" viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" ref={r => this.svg = r}>
                <g ref={r => this.mainG = select(r)} onDoubleClick={this.zoomOut}>
                    { protein && plotContentGenerator() }
                </g>
                { mouseOverPepId && plotPopover()}
            </svg>
            </div>
        )

    }
}

SliceSilacPlot.propTypes = {
    zoomLeft: PropTypes.number,
    zoomRight: PropTypes.number,
    actions: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    protein: PropTypes.object,
    sampleSelection: PropTypes.array.isRequired,
    mouseOverPepId: PropTypes.string,
    mouseOverPepInfo: PropTypes.object,
    mouseOverPepPos: PropTypes.array,
    filteredPepList: PropTypes.array
};

function mapStateToProps(state) {
    const props = {
        zoomLeft: state.plotReducer.zoomLeft,
        zoomRight: state.plotReducer.zoomRight,
        protein: state.plotReducer.protein,
        sampleSelection: state.plotReducer.sampleSelection,
        mouseOverPepId: state.plotReducer.mouseOverPepId,
        mouseOverPepInfo: state.plotReducer.mouseOverPepInfo,
        mouseOverPepPos: state.plotReducer.mouseOverPepPos,
        filteredPepList: state.plotReducer.filteredPepList
    };

    return props;
}

function mapDispatchToProps(dispatch) {
    const actionMap = {
        actions: bindActionCreators(ControlActions, dispatch)
    };
    return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(SliceSilacPlot);