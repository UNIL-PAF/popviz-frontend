import React, {
    Component,
} from 'react';
import PropTypes from "prop-types";

class Cleavage extends Component {

    render() {
        const { xPos, xScale, yPos } = this.props;

        return <path
            d="M10,17.5L3.5,11H7V3h6v8h3.5L10,17.5z"
            transform={"translate(" + (xScale(xPos + 0.5) - 10) + "," + yPos + ")"}
            fill={"red"}
            strokeWidth={1}
            stroke={"black"}
        />

    }

}

Cleavage.propTypes = {
    xPos: PropTypes.number.isRequired,
    yPos: PropTypes.number.isRequired,
    xScale: PropTypes.func.isRequired,
};

export default Cleavage