import { CHANGE_ZOOM_RANGE, MOUSE_OVER_PEP } from '../actions/const'

const defaultState = {
  zoomLeft:null,
    zoomRight:null,
    mouseOverPepId:null
};

export default function changePlot(state = defaultState, action = null) {
  switch (action.type) {
    case CHANGE_ZOOM_RANGE:
      return  {
        ...state,
        zoomLeft: action.zoomLeft,
        zoomRight: action.zoomRight,
      }
    case MOUSE_OVER_PEP:
      return {
        ...state,
        mouseOverPepId: action.id
      }
    default:
      return state

  }
}