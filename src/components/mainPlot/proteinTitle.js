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

            const loopAltProts = (desc) => {
                const lengthCheck = desc.length - 1

                return desc.map( (d,i) => {
                    const geneName = (geneName) => {return (geneName ? <em>({geneName})</em> : '')}
                    const acGene = () => {return <span>{d.ac}  {geneName(d.gene_name)}{i < lengthCheck ? ',' : ''}&nbsp;</span>}
                    const res = (sel) => { return sel ? <strong>{acGene()}</strong> : acGene() }
                    return <span key={i}>{res(d.selected)}</span>
                })
            }

            return <Col md={3}>
                <div>
                    <h4>All proteins:</h4> <h5>{loopAltProts(protein.descriptions)}</h5>
                </div>
                {! protein.isBestHit && <span style={{color: 'red'}}>Selected protein is not the best hit in this protein group.</span>}
            </Col>
        }

        const loopProteinNames = (desc) => {
            const lengthCheck = desc.length - 1

            return desc.map( (d,i) => {
                const protName = () => {return <span>{d.protein_name}{i < lengthCheck ? ',' : ''}&nbsp;</span>}
                const res = (sel) => { return sel ? <strong>{protName()}</strong> : protName() }
                return <span key={i}>{res(d.selected)}</span>
            })
        }

        const plotDescription = (hasAltProts) => {
            return <Col md={ hasAltProts ? 6 : 9 }>
                <div>
                    <h4>Descriptions:</h4> <h5>{loopProteinNames(protein.descriptions)}</h5>
                </div>
            </Col>
        }

        const plotTitle = () => {
            const geneName = protein.geneName ? "(" + protein.geneName + ")" : ""

            return <Row>
                <Col md={3} className="text-center">
                    <h4 float="left"><strong>{protein.proteinAC} <em>{geneName}</em></strong></h4>
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