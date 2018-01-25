import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';

class SelectionPopOver extends Component {





}


SelectionPopOver.propTypes = {
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

export default connect(null, mapDispatchToProps)(SelectionPopOver);