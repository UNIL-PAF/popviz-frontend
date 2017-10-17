import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ControlActions from '../../actions'

class SelectSamples extends Component {

    changeSelection = e => {
        var origSampleSelection = this.props.sampleSelection;

        var newSampleSelection = origSampleSelection.map((ss) => {
            return ss.sampleName === e.target.value ? {...ss, selected: !ss.selected} : ss;
        })

        this.props.actions.changeSampleSelection(newSampleSelection);
    }

    render() {
        const {sampleSelection} = this.props;

        const renderCheckboxes = (sampleSelection) => {

            return sampleSelection.map((ss, i) => {
                return <div className="checkbox-inline" key={i}>
                    <label>
                        <input type="checkbox" id={'checkbox-'+ss.sampleName} value={ss.sampleName} checked={ss.selected} onChange={this.changeSelection}/>
                        {ss.sampleName}
                    </label>
                </div>
            })
        }

        return (
            <div>
                {renderCheckboxes(sampleSelection)}
            </div>
        )

    }
}

SelectSamples.propTypes = {
    sampleSelection: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    const props = {
        sampleSelection: state.controlReducer.sampleSelection
    };

    return props;
}

function mapDispatchToProps(dispatch) {
    const actionMap = {
        actions: bindActionCreators(ControlActions, dispatch)
    };
    return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectSamples);