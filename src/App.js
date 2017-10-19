import React, { Component } from 'react';
import './styles/App.css';

import LoadProteinInputs from './components/controls/loadProteinInputs'
import SelectSamples from './components/controls/selectSamples'
import SliceSilacPlot from './components/plot/sliceSilacPlot'

class App extends Component {
  render() {
      const p = {id:'hihi'}

    return (
      <div className="AppControls">
          <LoadProteinInputs/>
          <SelectSamples/>
        <div className="App-plot-area">
            <SliceSilacPlot width={800} height={300}/>
        </div>
      </div>
    );
  }
}

export default App;
