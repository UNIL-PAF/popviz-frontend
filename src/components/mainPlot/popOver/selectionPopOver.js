import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as ControlActions from '../../../actions'
import { bindActionCreators } from 'redux';
import * as _ from 'lodash';

import PopOverSkeleton from './popOverSkeleton'
import CopyClipboardButton from './copyClipboardButton'

class SelectionPopOver extends Component {

    render() {

        const {finalSelectionRect, mouseOverPepIds, filteredPepList} = this.props;

        // get the peptides with the selected id
        const peps = filteredPepList.filter( (p) => {
            return mouseOverPepIds.indexOf(p.id) > -1
        })

        const content = {
            '# peptides': mouseOverPepIds.length,
            'mean molWeight' : (Math.pow(10, _.meanBy(peps, 'molWeight'))).toFixed(1) + ' kDa'
        }

        // onCloseCb={this.props.actions.remove}

        const x = finalSelectionRect.endX + 10
        const y = finalSelectionRect.startY + 10
        const width = 140
        const height = 60

        // settings for the 'copy to clipboard' button
        const buttonWidth = 73
        const buttonHeight = 11
        const buttonText = "Copy to clipboard"

        return (
            <g>
                <PopOverSkeleton x={x} y={y} width={width} height={height} content={content}
                             removable={true} colSpace={90}/>
                <CopyClipboardButton x={x+width/2-buttonWidth/2} y={y+height-buttonHeight-10} width={buttonWidth} height={buttonHeight} data={peps} text={buttonText}/>
            </g>
        )

    }

}

SelectionPopOver.propTypes = {
    mouseOverPepIds: PropTypes.array.isRequired,
    finalSelectionRect: PropTypes.object.isRequired,
    filteredPepList: PropTypes.array.isRequired
}

function mapStateToProps(state) {
    const props = {
        mouseOverPepIds: state.plotReducer.mouseOverPepIds,
        finalSelectionRect: state.plotReducer.finalSelectionRect,
        filteredPepList: state.plotReducer.filteredPepList
    };

    return props;
}

function mapDispatchToProps(dispatch) {
    const actionMap = {
        actions: bindActionCreators(ControlActions, dispatch)
    };
    return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectionPopOver);