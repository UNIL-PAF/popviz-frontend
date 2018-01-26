import React, { Component } from 'react';
import './styles/App.css';
import { Navbar, Nav, Row, Col, NavItem } from 'react-bootstrap'

import sibLogo from './images/sib_logo_2.png';

import LoadProteinInputs from './components/plotControls/loadProteinInputs'
import SelectSamples from './components/plotControls/selectSamples'
import SliceSilacPlot from './components/mainPlot/sliceSilacPlot'
import ProteinTitle from './components/mainPlot/proteinTitle'
import Legends from './components/mainPlot/legends'
import FilterPeptides from './components/plotControls/filterPeptides'
import popVizConfig from './config'

class App extends Component {

  render() {

    return (
      <div className="AppControls">

          <Navbar fluid>
              <Navbar.Header>
                  <Navbar.Brand>
                      <div id="sib-logo">
                          <span>
                            <a href="http://www.sib.swiss/">
                                <img src={sibLogo} height="30" alt="SIB Swiss Institute of Bioinformatics"/>
                            </a>
                          </span>
                      </div>
                  </Navbar.Brand>
                  <Navbar.Toggle />
              </Navbar.Header>
              <Navbar.Collapse>
                  <Nav>
                      <LoadProteinInputs />
                      <SelectSamples/>
                      <FilterPeptides/>
                  </Nav>
                  <Nav pullRight>
                      <NavItem>Version {popVizConfig.version}</NavItem>
                  </Nav>
              </Navbar.Collapse>
          </Navbar>

          <ProteinTitle />

        <Row className="App-plot-area">
            <Col md={10}>
                <SliceSilacPlot width={800} height={300}/>
            </Col>
            <Col md={2} className="pull-left">
                <Legends width={112} height={300}/>
            </Col>
        </Row>

      </div>
    );
  }
}

export default App;
