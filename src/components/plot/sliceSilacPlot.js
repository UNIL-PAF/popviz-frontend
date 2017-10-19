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

class SliceSilacPlot extends Component {

    constructor(props) {
        super(props)

        this.state = {
            xScale: scaleLinear().range([0, this.props.width]),
            yScale: scaleLinear().range([this.props.height, 0]),
            colorScale: scaleLinear().domain([2,-2]).range([0,1])
        }
    }

    mouseOverPep = (e) => {
        console.log(e.target)
        console.log('on Mouse Over')
    }

    brushend = () => {
        console.log('brushend')
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
        const {width, height, zoomLeft, zoomRight, protein, sampleSelection, mouseOverPepId} = this.props;

        // create the peptides
        const pepGenerator = (protein, mouseOverPepId) => {
            if(protein) {
                const thisZoomLeft = (zoomLeft == null) ? 1 : zoomLeft;
                const thisZoomRight = (zoomRight == null) ? protein.sequenceLength : zoomRight;

                this.state.xScale.domain([thisZoomLeft,thisZoomRight]);
                this.state.yScale.domain([protein.minMolWeight, protein.maxMolWeight]);

                // render only peptides within the zoom range
                const filteredPeps = protein.peptides.filter( (p) => {
                    return p.startPos <= thisZoomRight && p.endPos >= thisZoomLeft;
                });

                // create array of selected samples
                const selectedSamples = sampleSelection.filter( (ss) => {return ss.selected;}).map( (ss) => {return ss.sampleName})
                const nrSelectedSamples = selectedSamples.length

                // render only peptides from selected samples
                const selectedPeps = filteredPeps.filter( (p) => {
                    return selectedSamples.indexOf(p.sampleName) >= 0;
                });


                const pepList = selectedPeps.map((p,i) => {
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
                        key={i}
                    />
                })

                return pepList;
            }
        }

        return (
            <svg className="slice-silac-svg" viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
                <g ref={r => this.mainG = select(r)} onDoubleClick={this.zoomOut}>
                    {pepGenerator(protein, mouseOverPepId)}
                </g>
            </svg>
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
    mouseOverPepId: PropTypes.string
};

function mapStateToProps(state) {
    const props = {
        zoomLeft: state.plotReducer.zoomLeft,
        zoomRight: state.plotReducer.zoomRight,
        protein: state.controlReducer.protein,
        sampleSelection: state.controlReducer.sampleSelection,
        mouseOverPepId: state.plotReducer.mouseOverPepId
    };

    console.log(props)

    return props;
}

function mapDispatchToProps(dispatch) {
    const actionMap = {
        actions: bindActionCreators(ControlActions, dispatch)
    };
    return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(SliceSilacPlot);