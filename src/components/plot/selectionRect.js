import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';

class SelectionRect extends Component {

    render() {
        const {startX, startY, endX, endY} = this.props.selectionRect;

        // we have to inverse the rect if the mouse pointer is on the left of the start position
        const x = (endX > startX) ? startX : endX
        const y = (endY > startY) ? startY : endY
        const width = Math.abs(endX - startX)
        const height = Math.abs(endY - startY)

        return <rect
            id="selection-rect"
            x={x}
            y={y}
            width={width}
            height={height}
            />
    }

}

SelectionRect.propTypes = {
    selectionRect: PropTypes.object.isRequired
};

export default SelectionRect