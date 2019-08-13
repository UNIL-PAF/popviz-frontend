import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import { Button , FormGroup, InputGroup, Navbar } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Autosuggest from 'react-autosuggest';

import * as ControlActions from '../../actions'
import {loadProteinFromBackend} from './loadProteinFromBackend'
import {loadFastaHeadersFromBackend} from './loadFastaHeadersFromBackend'
import LoadingSvgIcon from './loadingSvgIcon'

class LoadProteinInputs extends Component {

    constructor(props) {
        super(props)

        this.state = {
            value: '',
            suggestions: [],
            isLoading: false
        }
    }

    componentDidMount(){
        // in case there is a path "protein" provided we parse the protein from there
        if(window.location.href.includes("protein")){
            const ac = this.parseUrlPath(window.location.href)
            if(ac) this.props.actions.loadProtein(ac);
        }
    }

    parseUrlPath = path => {
        const rexp = /.+protein\/(.+)$/
        const a = rexp.exec(path)
        return a ? a[1] : null
    }

    parseUrlBase = path => {
        const rexp = /(.+)#.+/
        const a = rexp.exec(path)
        return a ? a[1] : null
    }

    setUrlPath = proteinAc => {
        var currentUrl = window.location.href

        // set the URL to the new protein
        if(currentUrl.includes('#')){
            currentUrl = this.parseUrlBase(currentUrl)
        }

        window.location.href = "#/protein/" + proteinAc
    }

    setSuggestions = value => {
        //const valHead = (value.length > 100) ? value.slice(0, 100) : value

        this.setState({
            isLoading: false,
            suggestions: value
        })
    }

    getSuggestions = value => {
        if(! this.state.isLoading){
            this.setState({ isLoading: true });
            loadFastaHeadersFromBackend(value, this.setSuggestions)
        }
    }

    getSuggestionValue = suggestion => {
        return suggestion.proteinAC
    }

    renderSuggestion = suggestion => {
        const {value} = this.state

        const lcVal = this.state.value.toLowerCase()
        const fastaString = suggestion.fastaHeaders
        const lcFastaString = fastaString.toLowerCase()
        const hitPos = lcFastaString.indexOf(lcVal)
        const highlightedString = <span>{fastaString.slice(0,hitPos)}<strong><em>{fastaString.slice(hitPos, hitPos+value.length)}</em></strong>{fastaString.slice(hitPos + value.length - fastaString.length)}</span>

        return <div>
            <strong>{suggestion.proteinAC}:</strong>&nbsp;{highlightedString}
        </div>
    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };

    onLoadProtein = e => {
        this.props.actions.loadProtein(this.state.value);

        // set the URL to the new protein
        this.setUrlPath(this.state.value)
    }

    onSuggestionsFetchRequested = ({ value }) => {
            if(value.trim().length >= 3){
                this.getSuggestions(value)
            }else{
                this.setState({ suggestions: []})
            }

    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    // load the suggested
    onSuggestionSelected = (e, {suggestionValue}) => {
        this.props.actions.loadProtein(suggestionValue)

        // set the URL to the new protein
        this.setUrlPath(suggestionValue)
    }

    renderInputComponent = inputProps => (
        <div className="inputContainer">
            {this.state.isLoading && <LoadingSvgIcon/>}
            <input {...inputProps}/>
        </div>
    );

    render() {
        const {proteinAC, isLoading, actions} = this.props;
        const {value, suggestions} = this.state;

        if(isLoading) loadProteinFromBackend(proteinAC, actions.proteinIsLoaded, actions.stopLoadingProtein);

        const inputProps = {
            placeholder: 'e.g. TFRC',
            value,
            onChange: this.onChange
        };

        const renderAutosuggest = () => {
            return <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                onSuggestionSelected={this.onSuggestionSelected}
                inputProps={inputProps}
                renderInputComponent={this.renderInputComponent}
            />
        }

        return (
                <Navbar.Form pullLeft>
                    <FormGroup onSubmit={this.onLoadProtein}>
                        <InputGroup>
                            {renderAutosuggest()}
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
    proteinAC: PropTypes.string,
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