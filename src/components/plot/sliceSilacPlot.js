import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { brushX } from 'd3-brush';
import { axisLeft, axisBottom } from 'd3-axis';
import * as d3 from 'd3';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ControlActions from '../../actions'
import * as _ from 'lodash';
import { schemeCategory20 } from 'd3-scale';

import Peptide from './peptide'
import PeptidePopOver from './peptidePopOver'
import AminoAcidBar from './aminoAcidBar'
import PeptideAaSequences from './peptideAaSequences'
import TheoProtWeight from './theoProtWeight'

class SliceSilacPlot extends Component {

    constructor(props) {
        super(props)

        this.state = {
            xScale: scaleLinear().range([0, this.props.width - this.margin.left - this.margin.right]),
            yScale: scaleLinear().range([this.props.height - this.margin.top - this.margin.bottom, 0]),
            additionalHeight: 0
        }
    }

    // we use this proteinAC to verify if we have to redraw certain elements (e.g. y-axis)
    proteinAC = undefined

    // set the margins
    margin = {top: 20, right: 10, bottom: 100, left: 40};

    // we take first the dark colors from "schemeCategory20" and afterwards the lighter ones
    colorSchemeArray = _.range(0, 19, 2).concat(_.range(1, 20, 2))

    brushend = () => {
        var s = d3.event.selection;
        if(s){
            const newDomain = s.map(this.state.xScale.invert, this.state.xScale);
            this.props.actions.changeZoomRange(newDomain[0], newDomain[1]);

            // remove the brush area
            this.brushG.call(brushX().move, null)
        }
    }

    componentDidMount(){
        setTimeout(() => this.brushG.call(brushX(this.state.xScale).on('end', this.brushend)))
    }

    componentDidUpdate(){
        const {protein} = this.props;

        // add the x-axis
        const xAxis = axisBottom(this.state.xScale)
        select(this.xAxis).call(xAxis)

        // re-draw the y-axis only if the protein changed
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
        const {protein} = this.props;
        if(protein){
            this.props.actions.changeZoomRange(1, protein.sequenceLength);
        }
    }

    render() {
        const {
            width,
            height,
            zoomLeft,
            zoomRight,
            protein,
            filteredPepList,
            mouseOverPepIds,
            mouseOverPopover,
            sampleSelection,
            openPopovers,
            openPopoversId
        } = this.props;

        // create an array with entries for every AA position
        var aaShiftArray = []

        // highlight the peptide which the mouse is over or a popover is opened
        const highlightPeptide = (pepId) => {
            if(mouseOverPepIds && mouseOverPepIds.indexOf(pepId) > -1){
                return true
            }
            if(openPopoversId.length > 0 && openPopoversId.indexOf(pepId) > -1){
                return true
            }
            return false
        }

        // create the array containing the peptide plot elements
        const plotPeptides = (selectedPeps, thisZoomLeft, thisZoomRight, selectedSamples) => {
            const nrSelectedSamples = selectedSamples.length

            return selectedPeps.map((p,i) => {

                return <Peptide
                    zoomLeft={thisZoomLeft}
                    zoomRight={thisZoomRight}
                    xScale={this.state.xScale}
                    yScale={this.state.yScale}
                    pepInfo={p}
                    mouseIsOver={highlightPeptide(p.id)}
                    samplePos={selectedSamples.indexOf(p.sampleName)}
                    nrSamples={nrSelectedSamples}
                    svgParent={this.svg}
                    key={i}
                />
            })
        }

        // plot the theoretical weight line
        const plotTheoProtWeight = (theoWeight, thisZoomLeft, thisZoomRight, yScale, xScale) => {
            return <TheoProtWeight
                key={"theoProtWeight"}
                protWeight={theoWeight}
                zoomLeft={thisZoomLeft}
                zoomRight={thisZoomRight}
                yScale={yScale}
                xScale={xScale}
                />
        }

        // create the plot area
        const plotContentGenerator = () => {
            const thisZoomLeft = (zoomLeft === undefined) ? 1 : zoomLeft;
            const thisZoomRight = (zoomRight === undefined) ? protein.sequenceLength : zoomRight;

            // change the scale after zooming
            this.state.xScale.domain([thisZoomLeft, thisZoomRight]);
            // add margin for y axis
            const minMolWeightDa = Math.pow(10, protein.minMolWeight)
            const maxMolWeightDa = Math.pow(10, protein.maxMolWeight)
            const marginMin = Math.log10(minMolWeightDa - 1)
            const marginMax = Math.log10(maxMolWeightDa + 10)
            this.state.yScale.domain([marginMin, marginMax]);

            // create array of selected samples
            const selectedSamples = sampleSelection.filter((ss) => {
                return ss.selected;
            }).map((ss) => {
                return ss.sampleName
            })

            // plot the theoretical prot weight
            var finalPlotList = [(plotTheoProtWeight(protein.theoMolWeightLog10, thisZoomLeft, thisZoomRight, this.state.yScale, this.state.xScale))]

            // construct and concat the different elements of the plot
            finalPlotList = finalPlotList.concat(plotPeptides(filteredPepList, thisZoomLeft, thisZoomRight, selectedSamples))

            // plot the AA bar
            finalPlotList.push(plotAminAcidBar(thisZoomLeft, thisZoomRight));

            // plot the peptide AA sequences
            finalPlotList.push(plotPeptideAaSequences(thisZoomLeft, thisZoomRight, selectedSamples))

            return finalPlotList
        }


        // prepare the peptide AA seuquences plot
        const plotPeptideAaSequences = (thisZoomLeft, thisZoomRight, selectedSamples) => {

            const [start, end] = [Math.floor(thisZoomLeft), Math.floor(thisZoomRight)]

            const plotOneSeq = (seqInfo, sampleName, sampleColor) => {

                const seq = seqInfo.sequence.split('')

                // find shift and update the array
                var maxShift = 0
                for (var i = 0; i < seq.length; i++) {
                    const pos = seqInfo.startPos + i - start
                    const posVal = aaShiftArray[pos] ? aaShiftArray[pos] : 0
                    if (posVal > maxShift) maxShift = posVal
                    const posShift = posVal + 1
                    aaShiftArray[pos] = posShift
                }

                return <PeptideAaSequences
                    sampleName={sampleName}
                    seqInfo={seqInfo}
                    seq={seq}
                    sampleColor={sampleColor}
                    start={start}
                    end={end}
                    maxShift={maxShift}
                    xScale={this.state.xScale}
                    yPos={height - this.margin.bottom + 10}
                    yShift={10}
                    key={'pep-aa-seq' + sampleName + seq}
                />

            }

            const plotOneSample = (sampleName, thisZoomLeft, thisZoomRight) => {

                const sampleIdx = _.findIndex(sampleSelection, (s) => { return s.sampleName === sampleName; })
                const sampleColor = schemeCategory20[this.colorSchemeArray[sampleIdx]]

                // keep only sequences within the zoom range
                const seqs = protein.samples[sampleName].peptideSequences

                const fltSeqs = seqs.filter((s) => {
                    return (s.startPos > thisZoomLeft && s.startPos < thisZoomRight) || (s.endPos < thisZoomRight && s.endPos > thisZoomLeft)
                })

                const oneSeqPlot =  _.flatMap(fltSeqs, (s) => {
                    return plotOneSeq(s, sampleName, sampleColor)
                })

                return oneSeqPlot
            }

            // loop through the selected samples
            const peptideAaSequencesPlot =  _.flatMap(selectedSamples, (s) => plotOneSample(s, thisZoomLeft, thisZoomRight));
            return peptideAaSequencesPlot

        }

        // prepare the AA bar
        const plotAminAcidBar = (thisZoomLeft, thisZoomRight) => {

            return <AminoAcidBar
                    zoomLeft={thisZoomLeft}
                    zoomRight={thisZoomRight}
                    sequence={protein.sequence}
                    xScale={this.state.xScale}
                    yPos={height - this.margin.bottom + 1}
                    key="amino-acid-bar"
                />
        }

        // create popover when mouse is over a peptide
        const plotPopoverGenerator = () => {
            return <PeptidePopOver
                popOverInfo={mouseOverPopover}
            />
        }

        // plot the popovers on which we clicked
        const plotOpenPopoversGenerator = () => {
            return openPopovers.map((p, i) => {
                return <PeptidePopOver
                    popOverInfo={p}
                    removable={true}
                    key={i}
                />
            });
        }

        const mainPlot = () => {
            const plotContent = protein ? plotContentGenerator() : null
            const plotPopover = mouseOverPopover ? plotPopoverGenerator() : null
            const plotOpenPopovers = (openPopovers.length > 0) ? plotOpenPopoversGenerator() : null

            // adapt the viewPort height by calling the callback from sliceSilacPlot
            // we only have to adapt if the maxShift is > 7
            const maxShift = (aaShiftArray.length) ? _.max(aaShiftArray) : 0
            const additionalHeight = (maxShift > 7) ? ((maxShift-7) * 10) : 0

             return <div>
                <svg className="slice-silac-svg" viewBox={`0 0 ${width} ${height + additionalHeight}`} width="100%" height="100%" ref={r => this.svg = r}>
                    <g className="y-axis" ref={r => this.yAxis = r} transform={'translate('+this.margin.left+','+this.margin.top+')'} />
                    <g className="x-axis" ref={r => this.xAxis = r} transform={'translate('+this.margin.left + ','+(height-this.margin.bottom)+')'} />
                    <g className="brush-g" ref={r => this.brushG = select(r)} onDoubleClick={this.zoomOut} transform={'translate('+this.margin.left+','+this.margin.top+')'}/>
                    <g className="main-g" transform={'translate('+this.margin.left+','+this.margin.top+')'}>
                        { plotContent }
                    </g>
                    { plotOpenPopovers }
                    { plotPopover }
                </svg>
            </div>
        }

        return (
            mainPlot()
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
    mouseOverPepIds: PropTypes.array,
    mouseOverPopover: PropTypes.object,
    filteredPepList: PropTypes.array,
    openPopovers: PropTypes.array.isRequired,
    openPopoversId: PropTypes.array.isRequired
};

function mapStateToProps(state) {
    const props = {
        zoomLeft: state.plotReducer.zoomLeft,
        zoomRight: state.plotReducer.zoomRight,
        protein: state.plotReducer.protein,
        sampleSelection: state.plotReducer.sampleSelection,
        mouseOverPepIds: state.plotReducer.mouseOverPepIds,
        mouseOverPopover: state.plotReducer.mouseOverPopover,
        filteredPepList: state.plotReducer.filteredPepList,
        openPopovers: state.plotReducer.openPopovers,
        openPopoversId: state.plotReducer.openPopoversId
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