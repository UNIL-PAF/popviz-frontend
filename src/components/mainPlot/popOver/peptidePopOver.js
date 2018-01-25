import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as ControlActions from '../../../actions'
import { bindActionCreators } from 'redux';

import PopOverSkeleton from './popOverSkeleton'

class PeptidePopOver extends Component {

    render() {
        const {popOverInfo, limitRight, removable} = this.props;

        const popupShiftX = -10;
        const popupShiftY = -20;

        var [x,y] = [popOverInfo.x + popupShiftX, popOverInfo.y + popupShiftY]

        const seqLengthCorr = (popOverInfo.pepInfo.sequence.length > 10) ? (popOverInfo.pepInfo.sequence.length - 10) * 5 : 0;

        const width = 150 + seqLengthCorr

        // if the popover lies outside the plot area, we place it left of the mouse position
        if(x+width > limitRight)x = x-width-50
        if(y < 0) y = 0

        const pepInfo = popOverInfo.pepInfo

        const plotInfoObj = {
            'Sample': pepInfo.sampleName,
            'Sequence': pepInfo.aminoAcidBefore + '.' + pepInfo.sequence + '.' + pepInfo.aminoAcidAfter,
            'Start pos': pepInfo.startPos,
            'End pos': pepInfo.endPos,
            'Mol weight': Math.pow(10, pepInfo.molWeight).toFixed(2) + ' kDa',
            'H/L Ratio (log2)': pepInfo.log2ratio.toFixed(2),
            'Count': pepInfo.ratioCount
        }

        return (
            <PopOverSkeleton x={x} y={y} width={width} height={80} content={plotInfoObj} onCloseCb={this.props.actions.removePopover} contentId={popOverInfo.id} removable={removable}/>
        )

    }
}

PeptidePopOver.propTypes = {
    popOverInfo: PropTypes.object.isRequired,
    limitRight: PropTypes.number.isRequired,
    removable: PropTypes.bool
};


function mapDispatchToProps(dispatch) {
    const actionMap = {
        actions: bindActionCreators(ControlActions, dispatch)
    };
    return actionMap;
}

export default connect(null, mapDispatchToProps)(PeptidePopOver);