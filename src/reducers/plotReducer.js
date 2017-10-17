import { CHANGE_ZOOM_RANGE } from '../actions/const'

export default function changeZoomRange(state = { zoomLeft:null, zoomRight:null }, action = null) {
  switch (action.type) {
    case CHANGE_ZOOM_RANGE:
      return  {
        zoomLeft: action.zoomLeft,
        zoomRight: action.zoomRight,
      }
    default:
      return state

  }
}