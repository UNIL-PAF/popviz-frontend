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

        const {finalSelectionRect, mouseOverPepIds, filteredPepList, selectedSamples} = this.props;

        // get the peptides with the selected id
        const peps = filteredPepList.filter( (p) => {
            return mouseOverPepIds.indexOf(p.id) > -1
        })

        var content = {
            'Selected peptides': mouseOverPepIds.length
        }

        // add the means per sample
        const sampleMeans = selectedSamples.map( (sampleName) => {
            const samplePeps = peps.filter( (p) => {
                return p.sampleName === sampleName
            })

            return { name: 'Mean ' + sampleName, value: (Math.pow(10, _.meanBy(samplePeps, 'molWeight')))}
        })

        sampleMeans.forEach( (s) => {
          content[s.name] = s.value.toFixed(1) + ' kDa'
        })

        content['Mean of all means'] = _.meanBy(sampleMeans, 'value').toFixed(1) + ' kDa'

        const x = finalSelectionRect.endX + 10
        const y = finalSelectionRect.startY + 10
        const width = 140
        const height = 50 + selectedSamples.length * 10

        // settings for the 'copy to clipboard' button
        const buttonWidth = 73
        const buttonHeight = 11
        const buttonText = "Copy to clipboard"

        return (
            <g>
                <PopOverSkeleton x={x} y={y} width={width} height={height} content={content}
                             removable={true} colSpace={90} onCloseCb={this.props.actions.removeFinalSelection}/>
                <CopyClipboardButton x={x+width/2-buttonWidth/2} y={y+height-buttonHeight-10} width={buttonWidth} height={buttonHeight} data={peps} text={buttonText}/>
            </g>
        )

    }

}

SelectionPopOver.propTypes = {
    mouseOverPepIds: PropTypes.array.isRequired,
    finalSelectionRect: PropTypes.object.isRequired,
    filteredPepList: PropTypes.array.isRequired,
    selectedSamples: PropTypes.array.isRequired
}

function mapStateToProps(state) {
    const props = {
        mouseOverPepIds: state.plotReducer.mouseOverPepIds,
        finalSelectionRect: state.plotReducer.finalSelectionRect,
        filteredPepList: state.plotReducer.filteredPepList,
        selectedSamples: state.plotReducer.selectedSamples
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