import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import { NavDropdown, FormGroup, FormControl } from 'react-bootstrap'

import * as ControlActions from '../../actions'

class SelectSamples extends Component {

    constructor(props){
        super(props)

        this.state = {selectSampleGroupValue: ""};
    }

    changeSelection = e => {
        var origSampleSelection = this.props.sampleSelection;

        var newSampleSelection = origSampleSelection.map((ss) => {
            return ss.sampleName === e.target.value ? {...ss, selected: !ss.selected} : ss;
        })

        this.props.actions.changeSampleSelection(newSampleSelection);
    }

    changeSampleGroupSelection = e => {
        this.setState({selectSampleGroupValue:e.target.value});

        var origSampleSelection = this.props.sampleSelection;

        var newSampleSelection = origSampleSelection.map((ss) => {
            return ss.description === e.target.value ? {...ss, selected: true} : {...ss, selected: false};
        })

        this.props.actions.changeSampleSelection(newSampleSelection);
    }

    render() {
        const {sampleSelection} = this.props;

        const renderSampleGroups = () => {
            const desc = _.map(sampleSelection, 'description')
            const uniqDesc = _.uniq(desc)

            return uniqDesc.map( d => {
                return <option key={d} value={d}>{d}</option>
            })
        }

        const renderSourceSelectionDropdown = () => {
            return   <FormGroup controlId="formControlsSelect" className="sample-menu-dropdown">
                        <FormControl
                            componentClass="select"
                            onChange={this.changeSampleGroupSelection}
                            value={this.state.selectSampleGroupValue}
                        >
                            <option value="" hidden>Select a group...</option>
                            {renderSampleGroups()}
                        </FormControl>
                    </FormGroup>
        }

        const renderCheckboxes = (sampleSelection) => {

            return sampleSelection.map((ss, i) => {
                return <div key={i}>
                    <span className="sample-menu-item">
                        <input type="checkbox" id={'checkbox-'+ss.sampleName} value={ss.sampleName} checked={ss.selected} onChange={this.changeSelection}/>
                    </span>
                        <span className="sample-menu-item">
                        {ss.sampleName}
                        </span>
                        <span className="sample-menu-item">
                        <em>{ss.description}</em>
                        </span>
                </div>
            })
        }

        return (
            <NavDropdown title="Sample selection" id="basic-nav-dropdown">
                {renderSourceSelectionDropdown()}
                {renderCheckboxes(sampleSelection)}
            </NavDropdown>
        )

    }
}

SelectSamples.propTypes = {
    sampleSelection: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    const props = {
        sampleSelection: state.plotReducer.sampleSelection
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