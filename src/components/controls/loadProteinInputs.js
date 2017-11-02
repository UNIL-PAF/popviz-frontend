import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import { Button , FormGroup, InputGroup, FormControl, Navbar } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ControlActions from '../../actions'
import {loadProteinFromBackend} from './loadProteinFromBackend'

class LoadProteinInputs extends Component {

    constructor(props) {
        super(props)

        this.state = {proteinAC: props.proteinAC}
    }

    changeInput = e => {
        this.setState({proteinAC: e.target.value});
    }

    onLoadProtein = e => {
        this.props.actions.loadProtein(this.state.proteinAC);
    }

    render() {
        const {proteinAC, isLoading} = this.props;
        if(isLoading) loadProteinFromBackend(proteinAC, this.props.actions.proteinIsLoaded);

        return (
                <Navbar.Form pullLeft>
                    <FormGroup onSubmit={this.onLoadProtein}>
                        <InputGroup>
                            <FormControl type="text" value={this.state.proteinAC} onChange={this.changeInput} />
                            <InputGroup.Button>
                                <Button onClick={this.onLoadProtein}>Load</Button>
                            </InputGroup.Button>
                        </InputGroup>
                    </FormGroup>
                </Navbar.Form>
        )

    }
}

LoadProteinInputs.propTypes = {
    proteinAC: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    const props = {
        proteinAC: state.controlReducer.proteinAC,
        isLoading: state.controlReducer.isLoading
    };
    return props;
}

function mapDispatchToProps(dispatch) {
    const actionMap = {
        actions: bindActionCreators(ControlActions, dispatch)
    };
    return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadProteinInputs);