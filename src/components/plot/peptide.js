import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { select } from 'd3-selection';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ControlActions from '../../actions'
import { interpolateRdYlGn } from 'd3-scale-chromatic';

class Peptide extends Component {

    defaultRectHeight = 1;
    selRectHeight = 3;

    constructor(props){
        super(props)

        this.state = this.setDefaultRect();
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
        const {yScale, xScale, colorScale, pepInfo, nrSamples, samplePos, mouseIsOver} = this.props;

        const y = yScale(pepInfo.molWeight);
        const xStart = xScale(pepInfo.startPos);
        const xEnd = xScale(pepInfo.endPos);
        const xDiff = xEnd - xStart;

        // special settings if mouse is over this peptide
        const width = (mouseIsOver) ? xDiff : xDiff / nrSamples;
        const x = (mouseIsOver) ? xStart : xStart + (samplePos * width)
        const stroke = (mouseIsOver) ? 'black' : 'none'
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
                fill={interpolateRdYlGn(colorScale(pepInfo.log2ratio))}
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
    colorScale: PropTypes.func.isRequired,
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