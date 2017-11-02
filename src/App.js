import React, { Component } from 'react';
import './styles/App.css';
import { Grid, Row, Col, Navbar } from 'react-bootstrap'
import sibLogo from './images/sib_logo_2.png';



import LoadProteinInputs from './components/controls/loadProteinInputs'
import SelectSamples from './components/controls/selectSamples'
import SliceSilacPlot from './components/plot/sliceSilacPlot'

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
              <LoadProteinInputs />
          </Navbar>


          <Grid>
              <Row>
                  <Col md={3}></Col>
              </Row>
              <Row>
                  <Col md={12}><SelectSamples/></Col>
              </Row>
          </Grid>
        <div className="App-plot-area">
            <SliceSilacPlot width={800} height={300}/>
        </div>

              <hr/>
                  <div className="footer">
                      <p>shaped by&nbsp;
                          <a href="http://www.vital-it.ch/">Vital-IT</a>&nbsp;
                          <span>with&nbsp;</span>
                          <span className="glyphicon glyphicon-heart"></span>
                      </p>
                  </div>

      </div>
    );
  }
}

export default App;
