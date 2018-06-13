import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import { Row, Col } from 'react-bootstrap'
import ReactTable from 'react-table'
import * as _ from 'lodash';
import "react-table/react-table.css";
import * as ControlActions from "../../actions";
import { bindActionCreators } from 'redux';

class CleavageTable extends Component {

    constructor(props){
        super(props)
        this.state = {
            selected: []
        }
    }

    render() {
        const { protein } = this.props;

        const plotTable = () => {

            if(protein && protein.cleavages){
                return (
                    <div>
                        <Row>
                            <Col md={1}></Col>
                            <Col md={10}><h3>Cleavage table</h3></Col>
                            <Col md={1}></Col>
                        </Row>
                        <Row>
                            <Col md={1}></Col>
                            <Col md={10}>
                            <ReactTable
                                data = {protein.cleavages}
                                columns = {[
                                    {
                                        Header: "Position",
                                        accessor: "pos",
                                        maxWidth: 100,
                                        className: "center-column"
                                    },
                                    {
                                        Header: "Sequence",
                                        accessor: "seq",
                                        className: "center-column"
                                    },
                                    {
                                        Header: "Score",
                                        accessor: "probScore",
                                        maxWidth: 100,
                                        className: "center-column"
                                    },
                                    {
                                        Header: "Prediction",
                                        accessor: "prediction",
                                        maxWidth: 100,
                                        className: "center-column",
                                        Cell: row => (
                                            row.value ? <span className="glyphicon glyphicon-ok"
                                                              style={{"color":"green"}}></span> : <span></span>
                                        )

                                    },
                                    {
                                        Header: "Signal peptide",
                                        accessor: "signalPep",
                                        maxWidth: 100,
                                        className: "center-column",
                                        Cell: row => (
                                            row.value ? <span className="glyphicon glyphicon-ok"
                                                              style={{"color":"green"}}></span> : <span></span>
                                        )
                                    }
                                ]}
                                className = "-striped -highlight"
                                showPagination = {false}
                                getTrProps={(state, rowInfo) => {
                                    return {
                                        onClick: (e) => {
                                            console.log('got clicked: ', rowInfo)
                                            // remove if row was already selected otherwise add it
                                            const newSelected = this.state.selected.includes(rowInfo.index) ?
                                                _.filter(this.state.selected, function(x) { return x !== rowInfo.index} ) :
                                                this.state.selected.concat(rowInfo.index);

                                            this.setState({
                                                selected: newSelected
                                            })

                                            this.props.actions.toggleCleavage(rowInfo)
                                        },
                                        style: {
                                            background: this.state.selected.includes(rowInfo.index) ? '#00afec' : undefined,
                                            color: this.state.selected.includes(rowInfo.index) ? 'white' : undefined
                                        }

                                    }
                                }}
                            />
                            </Col>
                            <Col md={1}></Col>
                        </Row>
                    </div>
                )
            }
        }

        return (
            <div>
                {plotTable()}
            </div>
        )

    }
}

CleavageTable.propTypes = {
    protein: PropTypes.object
};

function mapStateToProps(state) {
    const props = {
        protein: state.plotReducer.protein
    };

    return props;
}

function mapDispatchToProps(dispatch) {
    const actionMap = {
        actions: bindActionCreators(ControlActions, dispatch)
    };
    return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(CleavageTable);
