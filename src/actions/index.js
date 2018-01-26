import * as types from './const'

/**
 *  "Control" actions
 */

export function loadProtein(proteinAC) {
  return { type: types.LOAD_PROTEIN, proteinAC: proteinAC }
}

export function stopLoadingProtein() {
    return { type: types.STOP_LOADING_PROTEIN }
}

export function changeSampleSelection(sampleSelection){
    return { type: types.CHANGE_SAMPLE_SELECTION, sampleSelection: sampleSelection}
}

export function filterPsms(filters){
    return { type: types.FILTER_PSMS, filters: filters}
}


/**
 *  "plot" actions
 */

export function proteinIsLoaded(protein) {
    return { type: types.PROTEIN_IS_LOADED, protein: protein }
}

export function changeZoomRange(zoomLeft, zoomRight) {
    return { type: types.CHANGE_ZOOM_RANGE, zoomLeft: zoomLeft, zoomRight: zoomRight }
}

export function mouseOverPep(id, x, y) {
    return { type: types.MOUSE_OVER_PEP, id: id , x: x, y: y}
}

export function clickOnPep(id, x, y) {
    return { type: types.CLICK_ON_PEP, id: id , x: x, y: y}
}

export function mouseOverSequence(sampleName, sequence){
    return { type: types.MOUSE_OVER_SEQUENCE, sampleName: sampleName, sequence: sequence }
}

export function removePopover(id){
    return { type: types.REMOVE_POPOVER, id: id }
}

export function shiftPressedDown(status){
    return { type: types.SHIFT_PRESSED_DOWN, isDown: status }
}

export function shiftAndMouseDown(status){
    return { type: types.SHIFT_AND_MOUSE_DOWN, isDown: status }
}

export function changeSelectionRect(x, y, aaPos, molWeight){
    return { type: types.CHANGE_SELECTION_RECT, x: x, y: y, aaPos: aaPos, molWeight: molWeight }
}

export function finalSelection(selectionRect){
    return { type: types.FINAL_SELECTION, selectionRect: selectionRect }
}

export function removeFinalSelection(){
    return { type: types.REMOVE_FINAL_SELECTION }
}