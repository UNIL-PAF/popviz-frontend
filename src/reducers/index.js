import { combineReducers } from 'redux';
import controlReducer from './controlReducer'
import plotReducer from './plotReducer'

const rootReducer = combineReducers({
  controlReducer,
  plotReducer
});

export default rootReducer;
