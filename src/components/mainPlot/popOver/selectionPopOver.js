import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as ControlActions from '../../../actions'
import { bindActionCreators } from 'redux';
import * as _ from 'lodash';

import PopOverSkeleton from './popOverSkeleton'

class SelectionPopOver extends Component {

    render() {

        const {finalSelectionRect, mouseOverPepIds, filteredPepList} = this.props;

        // get the peptides with the selected id
        const peps = filteredPepList.filter( (p) => {
            return mouseOverPepIds.indexOf(p.id) > -1
        })

        console.log(peps.length)

        const content = {
            '# peptides': mouseOverPepIds.length,
            'mean molWeight' : (Math.pow(10, _.meanBy(peps, 'molWeight'))).toFixed(1) + ' kDa'
        }

        console.log(mouseOverPepIds)
        console.log(filteredPepList)

        // onCloseCb={this.props.actions.remove}

        return (
            <PopOverSkeleton x={finalSelectionRect.endX} y={finalSelectionRect.startY} width={100} height={80} content={content}
                             removable={true}/>
        )

    }

}


SelectionPopOver.propTypes = {
    mouseOverPepIds: PropTypes.array.isRequired,
    finalSelectionRect: PropTypes.object.isRequired,
    filteredPepList: PropTypes.array.isRequired
};

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