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

        this.state = {
            yShift: 0,
            rectHeight: this.defaultRectHeight,
            rectBorder: 'none'
        }
    }

    mouseOverPep = (e) => {
        console.log(e.target)
        console.log('on Mouse Over')
        this.setState({ yShift :this.selRectHeight/2, rectHeight: this.selRectHeight, rectBorder: 'black' });
    }

    mousOutPep = () => {
        this.setState({ yShift :0, rectHeight: this.defaultRectHeight, rectBorder: 'none'});
    }

    render() {
        const {xScale, yScale, colorScale, pepInfo} = this.props;

        const xStart = xScale(pepInfo.startPos);
        const xEnd = xScale(pepInfo.endPos);
        const y = yScale(pepInfo.molWeight);

        return (
            <rect
                className="psm"
                id={pepInfo.id}
                x={xStart}
                y={y-this.state.yShift}
                width={xEnd-xStart}
                height={this.state.rectHeight}
                stroke={this.state.rectBorder}
                fill={interpolateRdYlGn(colorScale(pepInfo.log2ratio))}
                onMouseOver={this.mouseOverPep}
                onMouseOut={this.mousOutPep}
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
    actions: PropTypes.object.isRequired,
    pepInfo: PropTypes.object.isRequired
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