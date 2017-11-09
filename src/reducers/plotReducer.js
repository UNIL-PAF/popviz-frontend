import * as _ from 'lodash';

import {
    CHANGE_ZOOM_RANGE,
    MOUSE_OVER_PEP,
    PROTEIN_IS_LOADED,
    CHANGE_SAMPLE_SELECTION ,
    MOUSE_OVER_SEQUENCE,
    CLICK_ON_PEP,
    REMOVE_POPOVER,
    FILTER_PSMS
} from '../actions/const'

const defaultState = {
    zoomLeft: undefined,
    zoomRight: undefined,
    mouseOverPepIds: null,
    mouseOverPopover: null,
    sampleSelection: [
        {sampleName: '8967', selected: false, description: 'U2OS 4uM'},
        {sampleName: '9052', selected: false, description: 'U2OS 4uM'},
        {sampleName: '9053', selected: false, description: 'U2OS 4uM'},
        {sampleName: '8968', selected: false, description: 'U2OS 32uM'},
        {sampleName: '9508', selected: false, description: 'U2OS 32uM'},
        {sampleName: '9062', selected: true, description: 'HCT 2uM'},
        {sampleName: '9063', selected: true, description: 'HCT 2uM'},
        {sampleName: '9064', selected: true, description: 'HCT 2uM'},
        {sampleName: '8987', selected: false, description: 'HCT 32uM'},
        {sampleName: '9507', selected: false, description: 'HCT 32uM'}
    ],
    protein: null,
    filteredPepList: null,
    filteredPepSeqs: null,
    openPopovers: [],
    openPopoversId: [],
    filters: []
};

export default function changePlot(state = defaultState, action = null) {

    const computeSelectedSamples = (sampleSelection) => {
        return sampleSelection.filter((ss) => {
            return ss.selected;
        }).map((ss) => {
            return ss.sampleName
        })
    }

    // filter the peptide list by selected samples
    const createFilteredList = (peptides, selectedSamples) => {
        // render only peptides from selected samples
        return peptides.filter((p) => {
            return selectedSamples.indexOf(p.sampleName) >= 0;
        });
    }

    // filter peptides list by selected samples and its zoom range
    const createZoomedFilteredList = (peptides, selectedSamples, zoomLeft, zoomRight) =>{
        // render only peptides within the zoom range
        const filteredPeps = peptides.filter( (p) => {
            return (p.endPos > zoomLeft && p.endPos < zoomRight) || (p.startPos > zoomLeft && p.startPos < zoomRight);
        });

        return createFilteredList(filteredPeps, selectedSamples)
    }

    // filter by a given filter (e.g. on the H/L ratios)
    const createZoomedFilteredListWithFilters = (peptides, selectedSamples, zoomLeft, zoomRight, filters) => {
        const filteredPeps = (zoomLeft && zoomRight) ? createZoomedFilteredList(peptides, selectedSamples, zoomLeft, zoomRight) : createFilteredList(peptides, selectedSamples)

        const filterWithFilter = (peps, filters) => {
            return peps.filter( p => {
                const filterOk = filters.map( (f) => {
                    return  p.log2ratio >= f.filterRatioMin && p.log2ratio <= f.filterRatioMax
                })
                return filterOk.some( f => {return f})
            })
        }
        return (filters.length) ? filterWithFilter(filteredPeps, filters) : filteredPeps
    }

    const filterPepSeqs = (samples, filteredPepList, selectedSamples, zoomLeft, zoomRight) => {

        // filter by selected samples
        const samplesFlt = _.pick(samples, selectedSamples)

        // keep only sequences within the zoom range
        const filterByZoom = (seqs, zoomLeft, zoomRight) => seqs.filter((s) => {
            return (s.startPos > zoomLeft && s.startPos < zoomRight) || (s.endPos < zoomRight && s.endPos > zoomLeft)
        })

        const samplesZoomFlt = (zoomLeft && zoomRight) ? filterByZoom(samplesFlt, zoomLeft, zoomRight) : samplesFlt

        const validPeps = filteredPepList.map( p => {
            return p.sampleName + p.sequence + p.startPos
        })

        // keep only sequences which appear in the filteredPepList
        const uniqueSeqs = _.mapValues(samplesZoomFlt, (s, sampleName) => {
            return s.peptideSequences.filter( ps => {
                return validPeps.indexOf(sampleName+ps.sequence + ps.startPos) > -1
            })
        })

        return uniqueSeqs
    }

  switch (action.type) {
      case CHANGE_ZOOM_RANGE:
          const filteredPepList_changeZoomRange = (state.protein) ? (createZoomedFilteredListWithFilters(state.protein.peptides, state.selectedSamples, action.zoomLeft, action.zoomRight, state.filters)) : null
          return  {
              ...state,
              filteredPepList: filteredPepList_changeZoomRange,
              filteredPepSeqs: (state.protein) ? filterPepSeqs(state.protein.samples, filteredPepList_changeZoomRange, state.selectedSamples) : null,
              zoomLeft: action.zoomLeft,
              zoomRight: action.zoomRight,
              openPopovers: [],
              openPopoversId: []
          }
      case MOUSE_OVER_PEP:
          const getPopover = (filteredPepList, mouseOverPepId, x, y) => {
              if(! mouseOverPepId) return null;
              if(state.openPopoversId.length > 0 && state.openPopoversId.indexOf(action.id) > -1) return null

              const newPepInfo = filteredPepList.find((p) => {return p.id === mouseOverPepId})
              const newPopover = {
                  id: mouseOverPepId,
                  x: x,
                  y: y,
                  pepInfo: newPepInfo
              }
              return newPopover
          }
          const getPopoverIds = (id) => {
              if(state.openPopoversId.length > 0 && state.openPopoversId.indexOf(action.id) > -1){
                  return null;
              }else{
                  return [id]
              }
          }
          const newPopOver = getPopover(state.filteredPepList, action.id, action.x, action.y)
          const getHighlightPepSeq = (newPopOver) => {
              return {
                  sampleName: newPopOver.pepInfo.sampleName,
                  start: newPopOver.pepInfo.startPos,
                  end: newPopOver.pepInfo.endPos
              }
          }
          return {
              ...state,
              mouseOverPepIds: getPopoverIds(action.id),
              mouseOverPopover: newPopOver,
              highlightPepSeq: newPopOver ? getHighlightPepSeq(newPopOver) : null
          }
      case CLICK_ON_PEP:
          const addPopover = (filteredPepList, openPopovers, id, x, y) => {
              const newPepInfo = filteredPepList.find((p) => {return p.id === id})
              const newPopover = {
                  id: id,
                  x: x,
                  y: y,
                  pepInfo: newPepInfo
              }
              return openPopovers.concat(newPopover)
          }
          return {
              ...state,
              openPopovers: addPopover(state.filteredPepList, state.openPopovers, action.id, action.x, action.y),
              openPopoversId: state.openPopoversId.concat(action.id),
              mouseOverPepIds: null,
              mouseOverPopover: null,
              highlightPepSeq: null
          }
      case REMOVE_POPOVER:
          const removePopover = (id, openPopovers) => {
              return openPopovers.filter( (p) => {
                  return p.id !== id;
              })
          }
          const removePopoverId = (id, openPopoversId) => {
              return openPopoversId.filter( (p) => {
                  return p !== id;
              })
          }
          return {
              ...state,
              openPopovers: removePopover(action.id, state.openPopovers),
              openPopoversId: removePopoverId(action.id, state.openPopoversId)
          }
      case PROTEIN_IS_LOADED:
          const selectedSamples = computeSelectedSamples(state.sampleSelection)
          const filteredPepList = createZoomedFilteredListWithFilters(action.protein.peptides, selectedSamples, undefined, undefined, state.filters)

          return {
              ...state,
              filteredPepList: filteredPepList,
              filteredPepSeqs: filterPepSeqs(action.protein.samples, filteredPepList, selectedSamples),
              protein: action.protein,
              selectedSamples: selectedSamples,
              openPopovers: [],
              openPopoversId: [],
              zoomLeft: undefined,
              zoomRight: undefined
          }
      case CHANGE_SAMPLE_SELECTION:
          const selectedSamples2 = computeSelectedSamples(action.sampleSelection)
          const filteredPepList2 = state.protein ? createZoomedFilteredListWithFilters(state.protein.peptides, selectedSamples2, state.zoomLeft, state.zoomRight, state.filters) : null

          return {
              ...state,
              sampleSelection: action.sampleSelection,
              filteredPepList: filteredPepList2,
              filteredPepSeqs: state.protein ? filterPepSeqs(state.protein.samples, filteredPepList2, selectedSamples2): null,
              selectedSamples: selectedSamples2,
              openPopovers: [],
              openPopoversId: []
          }
      case FILTER_PSMS:
          const filteredPepList3 = state.protein ? createZoomedFilteredListWithFilters(state.protein.peptides, state.selectedSamples, state.zoomLeft, state.zoomRight, action.filters) : null

          return {
              ...state,
              filteredPepList: filteredPepList3,
              filteredPepSeqs: state.protein ? filterPepSeqs(state.protein.samples, filteredPepList3, state.selectedSamples): null,
              openPopovers: [],
              openPopoversId: [],
              filters: action.filters
          }
      case MOUSE_OVER_SEQUENCE:
          const isMouseOverSeq = (sampleName, seq) => {
              if(sampleName && seq){
                  return { sampleName: sampleName, sequence: seq }
              }else{
                  return null
              }
          }

          // find the pep ids to highlight (which have the same sample and sequence)
          const findPepIds = (sampleName, seq, filteredPepList) => {
              const peptides = filteredPepList.filter( (p) => {
                  return p.sampleName === sampleName && p.sequence === seq
              })
              return peptides.map( (p) => {
                  return p.id
              })
          }

          return {
              ...state,
              mouseOverSequence: isMouseOverSeq(action.sampleName, action.sequence),
              mouseOverPepIds: findPepIds(action.sampleName, action.sequence, state.filteredPepList),
              highlightPepSeq: null
          }
    default:
      return state

  }
}