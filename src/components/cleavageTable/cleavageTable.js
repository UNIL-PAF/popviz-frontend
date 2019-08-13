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

                // sort the cleavages by position
                const sortedCleavages = _.sortBy(protein.cleavages, 'pos')

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
                                data = {sortedCleavages}
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
                                    },
                                    {
                                        Header: "Confirmed",
                                        accessor: "confirmed",
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
                                defaultPageSize={protein.cleavages.length}
                                getTrProps={(state, rowInfo) => {
                                    const rowId = rowInfo ? rowInfo.original.pos : undefined

                                    return {
                                        onClick: (e) => {
                                            // remove if row was already selected otherwise add it
                                            const newSelected = this.state.selected.includes(rowId) ?
                                                _.filter(this.state.selected, function(x) { return x !== rowId} ) :
                                                this.state.selected.concat(rowId);

                                            this.setState({
                                                selected: newSelected
                                            })

                                            this.props.actions.toggleCleavage(rowInfo.original)
                                        },
                                        style: {
                                            background: this.state.selected.includes(rowId) ? '#00afec' : undefined,
                                            color: this.state.selected.includes(rowId) ? 'white' : undefined
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
