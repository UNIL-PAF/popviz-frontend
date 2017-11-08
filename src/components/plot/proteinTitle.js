import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap'

class ProteinTitle extends Component {

    render() {
        const { protein } = this.props;

        const plotAlternativeProteins = () => {
            const loopAltProts = (altProts) => {
                return altProts.map( (p,i) => {
                    return <span key={i}>{p}  <em>({protein.alternativeGeneNames[i]})</em>&nbsp;</span>
                })
            }

            return <Col md={3}>
                <h5>
                    Other proteins: <strong>{loopAltProts(protein.alternativeProteinACs)}</strong>
                </h5>
            </Col>
        }

        const plotDescription = (hasAltProts) => {
            return <Col md={ hasAltProts ? 6 : 9 }>
                <h5>
                    Description: <strong>{protein.description}</strong>
                </h5>
            </Col>
        }

        const plotTitle = () => {
            return <Row>
                <Col md={3} className="text-center">
                    <h4 float="left"><strong>{protein.proteinAC} <em>({protein.geneName})</em></strong></h4>
                </Col>
                { protein.alternativeProteinACs.length > 0 && plotAlternativeProteins()}
                { plotDescription(protein.alternativeProteinACs.length > 0) }
            </Row>
        }

        return protein ? plotTitle() : null;
    }
}

ProteinTitle.propTypes = {
    protein: PropTypes.object
};

function mapStateToProps(state) {
    const props = {
        protein: state.plotReducer.protein
    };

    return props;
}


export default connect(mapStateToProps, null)(ProteinTitle);