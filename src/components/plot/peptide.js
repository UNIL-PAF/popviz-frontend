import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ControlActions from '../../actions'

class Peptide extends Component {

    mouseOverPep = (e) => {
        console.log(e.target)
        console.log('on Mouse Over')
    }

    render() {
        const {xScale, yScale, pepInfo} = this.props;

        return (
            <line
                x1={xScale(pepInfo.startPos)}
                y1={yScale(pepInfo.molWeight)}
                x2={xScale(pepInfo.endPos)}
                y2={yScale(pepInfo.molWeight)}
                stroke="blue"
                strokeWidth="1"
                onMouseOver={this.mouseOverPep}
            />
        )

    }
}

Peptide.propTypes = {
    zoomLeft: PropTypes.number,
    zoomRight: PropTypes.number,
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
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