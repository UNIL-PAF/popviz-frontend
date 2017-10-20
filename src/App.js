import React, { Component } from 'react';
import './styles/App.css';
import { Grid, Row, Col } from 'react-bootstrap'



import LoadProteinInputs from './components/controls/loadProteinInputs'
import SelectSamples from './components/controls/selectSamples'
import SliceSilacPlot from './components/plot/sliceSilacPlot'

class App extends Component {
  render() {
    return (
      <div className="AppControls">
          <Grid>
              <Row>
                  <Col md={3}><LoadProteinInputs/></Col>
              </Row>
              <Row>
                  <Col md={12}><SelectSamples/></Col>
              </Row>
          </Grid>
        <div className="App-plot-area">
            <SliceSilacPlot width={800} height={300}/>
        </div>

      </div>
    );
  }
}

export default App;
