import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { brushX } from 'd3-brush';
import { axisLeft } from 'd3-axis';
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
            xScale: scaleLinear().range([0, this.props.width - this.margin.left - this.margin.right]),
            yScale: scaleLinear().range([this.props.height - this.margin.top - this.margin.bottom, 0]),
            colorScale: scaleLinear().domain([2,-2]).range([0,1])
        }
    }

    // we use this proteinAC to verify if we have to redraw certain elements (e.g. y-axis)
    proteinAC = undefined

    // set the margins
    margin = {top: 20, right: 10, bottom: 50, left: 30};

    brushend = () => {
        var s = d3.event.selection;
        if(s){
            const newDomain = s.map(this.state.xScale.invert, this.state.xScale);
            this.props.actions.changeZoomRange(newDomain[0]-this.margin.left, newDomain[1]-this.margin.left);

            // remove the brush area
            this.mainG.call(brushX().move, null)
        }
    }

    componentDidMount(){
        setTimeout(() => this.mainG.call(brushX(this.state.xScale).on('end', this.brushend)))
    }

    componentDidUpdate(){
        const {protein} = this.props;

        console.log('component did render')

        // re-draw the y-axis if the protein changed
        if(protein && protein.proteinAC !== this.proteinAC){

            const yAxis = axisLeft(this.state.yScale)
                .tickFormat((d) => { return Math.round(Math.pow(10,d)) + ' kDa'; })

            select(this.yAxis)
                .call(yAxis)

            // store the current proteinAC to make sure that we re-render the y-axis after a new protein loaded
            this.proteinAC = protein.proteinAC
        }


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

            // change the scale after zooming
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
                <g className="y-axis" ref={r => this.yAxis = r} transform={'translate('+this.margin.left+','+this.margin.top+')'} />
                <g ref={r => this.mainG = select(r)}
                   onDoubleClick={this.zoomOut}
                >
                    <g transform={'translate('+this.margin.left+','+this.margin.top+')'}>{ protein && plotContentGenerator() }</g>
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