import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';

class TheoProtWeight extends Component {


    render() {
        const { protWeight, zoomLeft, zoomRight, yScale, xScale } = this.props;

        return <line
            className="theo-prot-weight"
            x1={xScale(zoomLeft)}
            y1={yScale(protWeight)}
            x2={xScale(zoomRight)}
            y2={yScale(protWeight)}
        />

    }
}

TheoProtWeight.propTypes = {
    zoomLeft: PropTypes.number.isRequired,
    zoomRight: PropTypes.number.isRequired,
    yScale: PropTypes.func.isRequired,
    xScale: PropTypes.func.isRequired,
    protWeight: PropTypes.number.isRequired
};

export default (TheoProtWeight);