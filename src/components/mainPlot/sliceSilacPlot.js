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
import { sampleColor } from './colorSettings'

import Peptide from './peptide'
import PeptidePopOver from './popOver/peptidePopOver'
import SelectionPopOver from './popOver/selectionPopOver'
import AminoAcidBar from './aminoAcidBar'
import PeptideAaSequences from './peptideAaSequences'
import TheoProtWeight from './theoProtWeight'
import SelectionRect from './selectionRect'
import Cleavage from './cleavage'

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
    margin = {top: 5, right: 10, bottom: 30, left: 40};

    brushend = () => {
        var s = d3.event.selection;
        if(s){
            const newDomain = s.map(this.state.xScale.invert, this.state.xScale);
            this.props.actions.changeZoomRange(newDomain[0], newDomain[1]);

            // remove the brush area
            this.brushG.call(brushX().move, null)
        }
    }

    // handle the mouse down in case of shift pressed
    onMouseDown = () => {
        this.props.actions.shiftAndMouseDown(true)
    }

    onMouseUp = (e) => {
        this.props.actions.shiftAndMouseDown(false)
    }

    componentDidMount(){
        // add the listeners to check for any shift button pressed
        document.addEventListener( 'keydown', (e) => {
                if(e.key === 'Shift')
                    this.props.actions.shiftPressedDown(true)
            })
        document.addEventListener( 'keyup', (e) => {
                if(e.key === 'Shift')
                    this.props.actions.shiftPressedDown(false)
            })
    }

    componentDidUpdate(){
        const {protein, shiftPressedDown, shiftAndMouseDown, selectionRect} = this.props;

        // if shift is pressed, we can select a certain area.
        // Otherwise we have the brushX zoom
        if(shiftAndMouseDown){
            this.backgroundRect.on('mousemove', () => {
                const [x,y] = d3.mouse(this.svg)
                const xWithoutMargin = x - this.margin.left
                const yWithoutMargin = y - this.margin.top
                this.props.actions.changeSelectionRect(x, y, this.state.xScale.invert(xWithoutMargin), this.state.yScale.invert(yWithoutMargin))
            })
        }else{
            // we got the final selection rect
            if(selectionRect){
                this.props.actions.finalSelection(selectionRect)
            }

            if(this.backgroundRect){
                this.backgroundRect.on('mousemove', null)
            }
        }

        // if we don't have the shift pressed, we use the x-axis brush
        if(!shiftPressedDown){
            // add the brush for the x-axis zoom
            setTimeout(() => this.brushG.call(brushX(this.state.xScale).on('end', this.brushend)))
        }

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
            selectedSamples,
            openPopovers,
            openPopoversId,
            highlightPepSeq,
            filteredPepSeqs,
            shiftPressedDown,
            selectionRect,
            finalSelectionRect,
            cleavages
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

            // plot the theoretical prot weight
            var finalPlotList = [(plotTheoProtWeight(protein.theoMolWeightLog10, thisZoomLeft, thisZoomRight, this.state.yScale, this.state.xScale))]

            // construct and concat the different elements of the plot
            finalPlotList = finalPlotList.concat(plotPeptides(filteredPepList, thisZoomLeft, thisZoomRight, selectedSamples))

            // plot the AA bar
            finalPlotList.push(plotAminAcidBar(thisZoomLeft, thisZoomRight));

            // plot the peptide AA sequences
            finalPlotList.push(plotPeptideAaSequences(thisZoomLeft, thisZoomRight, selectedSamples))

            // plot popover
            if(openPopovers.length > 0) finalPlotList.push(plotOpenPopoversGenerator(this.state.xScale.range()[1]))
            if(mouseOverPopover) finalPlotList.push(plotPopoverGenerator(this.state.xScale.range()[1]))

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

                const highlight = ( highlightPepSeq && highlightPepSeq.sampleName === sampleName &&
                                    highlightPepSeq.start ===  seqInfo.startPos &&
                                    highlightPepSeq.end === seqInfo.endPos) ? true : false

                return <PeptideAaSequences
                    sampleName={sampleName}
                    seqInfo={seqInfo}
                    highlight={highlight}
                    seq={seq}
                    sampleColor={sampleColor}
                    start={start}
                    end={end}
                    maxShift={maxShift}
                    xScale={this.state.xScale}
                    yPos={height - this.margin.bottom + 28}
                    yShift={10}
                    key={'pep-aa-seq' + sampleName + seq}
                />

            }

            const plotOneSample = (sampleName) => {

                const fltSeqs = filteredPepSeqs[sampleName]

                // get the sampleIdx for the right coloring
                const sampleIdx = _.findIndex(sampleSelection, (s) => { return s.sampleName === sampleName; })


                const oneSeqPlot =  _.flatMap(fltSeqs, (s) => {
                    return plotOneSeq(s, sampleName, sampleColor(sampleIdx))
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
                    yPos={height - this.margin.bottom + 18}
                    key="amino-acid-bar"
                />
        }

        // create popover when mouse is over a peptide
        const plotPopoverGenerator = (limitRight) => {
            return <PeptidePopOver
                key={"pep-pop-over"}
                popOverInfo={mouseOverPopover}
                limitRight={limitRight}
            />
        }

        // plot the popovers on which we clicked
        const plotOpenPopoversGenerator = (limitRight) => {
            return openPopovers.map((p, i) => {
                return <PeptidePopOver
                    popOverInfo={p}
                    removable={true}
                    key={i}
                    limitRight={limitRight}
                />
            });
        }

        const plotCleavages = (cleavages) => {
            return cleavages.map((p, i) => {
              return <Cleavage
                  xPos={p.pos}
                  xScale={this.state.xScale}
                  yPos={height - this.margin.bottom }
                  key={"cleavage-" + i}
              />
            })
        }


        const mainPlot = (shiftPressedDown, selectionRect, finalSelectionRect, cleavages) => {
            const plotContent = protein ? plotContentGenerator() : null

            // adapt the viewPort height by calling the callback from sliceSilacPlot
            // we only have to adapt if the maxShift is > 7
            const maxShift = (aaShiftArray.length) ? _.max(aaShiftArray) : 0
            const additionalHeight = maxShift ? (maxShift * 11) : 0

            return <div>
                <svg className="slice-silac-svg"
                     viewBox={`0 0 ${width} ${height + additionalHeight}`}
                     width="100%"
                     height="100%"
                     ref={r => this.svg = r}
                >
                    <g className="y-axis" ref={r => this.yAxis = r}
                       transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}/>
                    <g className="x-axis" ref={r => this.xAxis = r}
                       transform={'translate(' + this.margin.left + ',' + (height - this.margin.bottom) + ')'}/>
                    { !shiftPressedDown &&
                    <g className="brush-g" ref={r => this.brushG = select(r)} onDoubleClick={this.zoomOut}
                       transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}/> }
                    <g className="main-g" transform={'translate(' + this.margin.left + ',' + this.margin.top + ')'}>
                        { plotContent }
                        { cleavages.length > 0 && plotCleavages(cleavages) }
                    </g>
                    { finalSelectionRect &&
                    <g>
                        <SelectionRect selectionRect={finalSelectionRect}/>
                        <SelectionPopOver />
                    </g>
                    }
                    { selectionRect && selectionRect.endX && <SelectionRect selectionRect={selectionRect}/> }
                    { shiftPressedDown &&
                    <rect fillOpacity={0} width="100%" height="100%" ref={r => this.backgroundRect = select(r)}
                          onMouseDown={(e) => this.onMouseDown(e)} onMouseUp={(e) => this.onMouseUp(e)}/>}
                </svg>
            </div>

        }

        return (
            mainPlot(shiftPressedDown, selectionRect, finalSelectionRect, cleavages )
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
    openPopoversId: PropTypes.array.isRequired,
    highlightPepSeq: PropTypes.object,
    filteredPepSeqs: PropTypes.object,
    selectedSamples: PropTypes.array,
    shiftPressedDown: PropTypes.bool,
    shiftAndMouseDown: PropTypes.bool,
    selectionRect: PropTypes.object,
    finalSelectionRect: PropTypes.object,
    cleavages: PropTypes.array
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
        openPopoversId: state.plotReducer.openPopoversId,
        highlightPepSeq: state.plotReducer.highlightPepSeq,
        filteredPepSeqs: state.plotReducer.filteredPepSeqs,
        selectedSamples: state.plotReducer.selectedSamples,
        shiftPressedDown: state.controlReducer.shiftPressedDown,
        shiftAndMouseDown: state.controlReducer.shiftAndMouseDown,
        selectionRect: state.plotReducer.selectionRect,
        finalSelectionRect: state.plotReducer.finalSelectionRect,
        cleavages: state.plotReducer.cleavages
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