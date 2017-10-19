import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ControlActions from '../../actions'
import { interpolateRdYlGn } from 'd3-scale-chromatic';

class Peptide extends Component {

    defaultRectHeight = 1;
    selRectHeight = 3;

    constructor(props){
        super(props)

        this.state = this.setDefaultRect(props);
    }

    mouseEnterPep = (e) => {
        const bBox = e.target.getBBox()
        console.log(e.clientX)
        this.props.actions.mouseOverPep(e.target.id, bBox.x, bBox.y)
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

    setDefaultRect = (props) => {
        return {
            yShift: 0,
            rectHeight: this.defaultRectHeight,
            rectBorder: 'none',
            mouseIsOver: false
        };
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
                onMouseEnter={this.mouseEnterPep}
                onMouseOut={this.mouseOutPep}
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
    mouseIsOver:  PropTypes.bool.isRequired
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