import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavDropdown, Button } from 'react-bootstrap'

import * as ControlActions from '../../actions'

class FilterPeptides extends Component {

    constructor(props){
        super(props)

        this.state = {
            filterRatio1: false,
            filterRatio2: false,
            minFilterRatio1: '',
            maxFilterRatio1: -1,
            minFilterRatio2: 1,
            maxFilterRatio2: '',
            menuOpen: false
        };
    }

    changeSelection = (e) => {
        const newVal = ! this.state[e.target.id]
        this.setState({
            [e.target.id]: newVal
        })
    }

    changeFilterVal = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    toggleMenu = (isOpen, e, toggleSource) => {
        if(isOpen || toggleSource.source === 'select'){
            this.setState({menuOpen: true})
        }else{
            this.setState({menuOpen: false})
        }
    }

    applyFilters = () => {
        const checkValues = (v) => {
            if(! isNaN(v)){
                return true
            }else{
                alert('Invalid ratio: The ratios have to be numeric')
                return false
            }
        }

        const filterRatios = [1,2].map( idx => {
            const filterRatioMin = this.state['minFilterRatio' + idx]
            const filterRatioMax = this.state['maxFilterRatio' + idx]

            if(this.state['filterRatio' + idx] && checkValues(filterRatioMin) && checkValues(filterRatioMax)){
                // set ridicule high values in case of missing values => for the filter this means that any ratio is OK
                const filterRatioMinCorr = (filterRatioMin) ? Number(filterRatioMin) : -1000000
                const filterRatioMaxCorr = (filterRatioMax) ? Number(filterRatioMax) : 1000000

                return {filterRatioMin: filterRatioMinCorr, filterRatioMax: filterRatioMaxCorr}
            }else{
                return null
            }
        })

        const validFilterRatios = filterRatios.filter( (f) => {return f} )

        this.props.actions.filterPsms(validFilterRatios);
    }

    render() {
        const renderRatioRange = (idx) => {

            const filterRatioState = this.state['filterRatio' + idx]
            const textCol = filterRatioState ? 'black' : 'lightgrey'

            return <div className="ratio-filter-line">
                <span className="sample-menu-item">
                    <input type="checkbox"  id={'filterRatio'+idx} value={'filterRatio'+idx} checked={filterRatioState} onChange={this.changeSelection}/>
                </span>
                <span className="ratio-filter-item" style={{color: textCol}}>from</span>
                <span className="ratio-filter-item" style={{color: textCol}}>
                    <input className="ratio-filter-input" type="input" id={'minFilterRatio'+idx} value={this.state['minFilterRatio' + idx]} onChange={this.changeFilterVal} disabled={! filterRatioState}/>
                </span>
                <span className="ratio-filter-item" style={{color: textCol}}>to</span>
                <span className="ratio-filter-item" style={{color: textCol}}>
                    <input className="ratio-filter-input" type="input" id={'maxFilterRatio'+idx} value={this.state['maxFilterRatio' + idx]} onChange={this.changeFilterVal} disabled={! filterRatioState}/>
                </span>
            </div>
        }

        const renderApplyButton = () => {
            return <div className="ratio-filter-button">
                    <span>
                        <Button bsStyle="primary" bsSize="small" onClick={this.applyFilters}>Apply</Button>
                    </span>
                </div>
        }

        return (
            <NavDropdown title="Filter" id="basic-nav-dropdown" onToggle={this.toggleMenu} open={this.state.menuOpen}>
                <div className="sample-menu-item ratio-filter-title"><strong>Keep H/L ratios (log2)</strong></div>
                {renderRatioRange(1)}
                {renderRatioRange(2)}
                {renderApplyButton()}
            </NavDropdown>
        )

    }
}

FilterPeptides.propTypes = {
    actions: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
    const actionMap = {
        actions: bindActionCreators(ControlActions, dispatch)
    };
    return actionMap;
}

export default connect(null, mapDispatchToProps)(FilterPeptides);