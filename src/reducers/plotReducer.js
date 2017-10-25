import { CHANGE_ZOOM_RANGE, MOUSE_OVER_PEP, PROTEIN_IS_LOADED, CHANGE_SAMPLE_SELECTION , MOUSE_OVER_SEQUENCE} from '../actions/const'

const defaultState = {
    zoomLeft: undefined,
    zoomRight: undefined,
    mouseOverPepIds: null,
    mouseOverPepInfo: null,
    sampleSelection: [
        {sampleName: '8967', selected: false},
        {sampleName: '9052', selected: false},
        {sampleName: '9053', selected: false},
        {sampleName: '8968', selected: false},
        {sampleName: '9508', selected: false},
        {sampleName: '9062', selected: true},
        {sampleName: '9063', selected: true},
        {sampleName: '9064', selected: true},
        {sampleName: '8987', selected: false},
        {sampleName: '9507', selected: false}
    ],
    protein: null,
    filteredPepList: null
};

export default function changePlot(state = defaultState, action = null) {

    // filter the peptide list by selected samples
    const createFilteredList = (peptides, sampleSelection) => {
        // create array of selected samples
        const selectedSamples = sampleSelection.filter((ss) => {
            return ss.selected;
        }).map((ss) => {
            return ss.sampleName
        })

        // render only peptides from selected samples
        return peptides.filter((p) => {
            return selectedSamples.indexOf(p.sampleName) >= 0;
        });
    }

    // filter peptides list by selected samples and its zoom range
    const createZoomedFilteredList = (peptides, sampleSelection, zoomLeft, zoomRight) =>{
        // render only peptides within the zoom range
        const filteredPeps = peptides.filter( (p) => {
            return (p.endPos > zoomLeft && p.endPos < zoomRight) || (p.startPos > zoomLeft && p.startPos < zoomRight);
        });

        return createFilteredList(filteredPeps, sampleSelection)
    }

  switch (action.type) {
      case CHANGE_ZOOM_RANGE:
          return  {
              ...state,
              filteredPepList: (state.protein) ? (createZoomedFilteredList(state.protein.peptides, state.sampleSelection, action.zoomLeft, action.zoomRight)) : null,
              zoomLeft: action.zoomLeft,
              zoomRight: action.zoomRight,
          }
      case MOUSE_OVER_PEP:
          const getPepInfo = (filteredPepList, mouseOverPepId) => {
              return filteredPepList.find((p) => {return p.id === mouseOverPepId})
          }
          return {
              ...state,
              mouseOverPepIds: [action.id],
              mouseOverPepInfo: getPepInfo(state.filteredPepList, action.id),
              mouseOverPepPos: [action.x, action.y]
          }
      case PROTEIN_IS_LOADED:
          return {
              ...state,
              filteredPepList: createFilteredList(action.protein.peptides, state.sampleSelection),
              protein: action.protein
          }
      case CHANGE_SAMPLE_SELECTION:
          const filterPepsAfterSampleSelection = (state, sampleSelection) => {
            if(state.protein){
                if(state.zoomLeft && state.zoomRight){
                    return createZoomedFilteredList(state.protein.peptides, sampleSelection, state.zoomLeft, state.zoomRight)
                }else{
                    return createFilteredList(state.protein.peptides, sampleSelection)
                }
            }else{
                return null
            }
          }

          return {
              ...state,
              sampleSelection: action.sampleSelection,
              filteredPepList: filterPepsAfterSampleSelection(state, action.sampleSelection)
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
              mouseOverPepIds: findPepIds(action.sampleName, action.sequence, state.filteredPepList)
          }
    default:
      return state

  }
}