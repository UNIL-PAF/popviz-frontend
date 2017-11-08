import React, { Component } from 'react';
import './styles/App.css';
import { Navbar, Nav, Row, Col } from 'react-bootstrap'

import sibLogo from './images/sib_logo_2.png';

import LoadProteinInputs from './components/controls/loadProteinInputs'
import SelectSamples from './components/controls/selectSamples'
import SliceSilacPlot from './components/plot/sliceSilacPlot'
import ProteinTitle from './components/plot/proteinTitle'
import Legends from './components/plot/legends'

class App extends Component {
  render() {
    return (
      <div className="AppControls">

          <Navbar fluid>
              <Navbar.Header>
                  <Navbar.Brand>
                      <div id="sib-logo">
                          <span>
                            <a href="http://www.isb-sib.ch/">
                                <img src={sibLogo} height="30" alt="SIB"/>
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
                  </Nav>
              </Navbar.Collapse>
          </Navbar>

          <ProteinTitle />

        <Row className="App-plot-area">
            <Col md={11}>
                <SliceSilacPlot width={800} height={300}/>
            </Col>
            <Col md={1} className="pull-left">
                <Legends width={72} height={300}/>
            </Col>
        </Row>

      </div>
    );
  }
}

export default App;
