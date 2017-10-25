import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ControlActions from '../../actions'

class Peptide extends Component {

    defaultRectHeight = 1;
    selRectHeight = 3;

    constructor(props){
        super(props)

        this.state = this.setDefaultRect();
    }

    // prepare the coloRange
    colorScale = scaleLinear().domain([-2, 0, 2]).range(["green", "lightgrey", "red"]);

    // limit ratio range to -2 and 2
    limitRatioRange = (ratio) => {
        if(ratio < -2) return -2
        if(ratio > 2) return 2
        return ratio
    }

    mouseOutPep = () => {
        this.props.actions.mouseOverPep(undefined)

        this.setState({
            yShift :0,
            rectHeight: this.defaultRectHeight,
            rectBorder: 'none',
        });
        const stateObj = this.setDefaultRect(this.props)
        this.setState(stateObj);
    }

    setDefaultRect = () => {
        return {
            yShift: 0,
            rectHeight: this.defaultRectHeight,
            rectBorder: 'none',
            mouseIsOver: false
        };
    }

    componentDidMount(){
        const {svgParent} = this.props;

        // this event we have to call using D3 in order to get the mouse position correctly
        select(this.rectDom).on('mouseenter', () => {
            const [x,y] = d3.mouse(svgParent)
            this.props.actions.mouseOverPep(this.rectDom.id, x, y)
        })
    }

    render() {
        const {yScale, xScale, pepInfo, nrSamples, samplePos, mouseIsOver} = this.props;

        const y = yScale(pepInfo.molWeight);
        const xStart = xScale(pepInfo.startPos);
        const xEnd = xScale(pepInfo.endPos);
        const xDiff = xEnd - xStart;

        // get the color according to its ratio
        const ratioCol = this.colorScale(this.limitRatioRange(pepInfo.log2ratio))

        // special settings if mouse is over this peptide
        const width = (mouseIsOver) ? xDiff : xDiff / nrSamples;
        const x = (mouseIsOver) ? xStart : xStart + (samplePos * width)
        const stroke = (mouseIsOver) ? ratioCol : 'none'
        const height = (mouseIsOver) ? this.selRectHeight : this.defaultRectHeight
        const yShift = (mouseIsOver) ? this.selRectHeight/2 : 0

        return (
            <rect
                className="psm"
                id={pepInfo.id}
                x={x}
                y={y-yShift}
                width={width}
                height={height}
                stroke={stroke}
                fill={ratioCol}
                onMouseOut={() => this.mouseOutPep()}
                ref={r => this.rectDom = r}
            />
        )

    }
}

Peptide.propTypes = {
    zoomLeft: PropTypes.number,
    zoomRight: PropTypes.number,
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
    samplePos: PropTypes.number.isRequired,
    nrSamples: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired,
    pepInfo: PropTypes.object.isRequired,
    mouseIsOver:  PropTypes.bool.isRequired,
    svgParent: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    const props = {
    };

    return props;
}

function mapDispatchToProps(dispatch) {
    const actionMap = {
        actions: bindActionCreators(ControlActions, dispatch)
    };
    return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(Peptide);