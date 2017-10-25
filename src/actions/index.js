import * as types from './const'

/**
 *  "Control" actions
 */

export function loadProtein(proteinAC) {
  return { type: types.LOAD_PROTEIN, proteinAC: proteinAC }
}



export function changeSampleSelection(sampleSelection){
    return { type: types.CHANGE_SAMPLE_SELECTION, sampleSelection: sampleSelection}
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

export function mouseOverSequence(sampleName, sequence){
    return { type: types.MOUSE_OVER_SEQUENCE, sampleName: sampleName, sequence: sequence}
}
