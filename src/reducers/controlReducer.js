import { LOAD_PROTEIN, PROTEIN_IS_LOADED, CHANGE_SAMPLE_SELECTION } from '../actions/const'

const defaultState = {
    proteinAC: 'P02786',
    isLoading: false
};

export default function reduceControlActions(state = defaultState, action = null) {
  switch (action.type) {
      case LOAD_PROTEIN:
      return  {
          ...state,
        proteinAC: action.proteinAC,
        isLoading: true
      }
      case PROTEIN_IS_LOADED:
          return{
              ...state,
              isLoading: false
          }
      case CHANGE_SAMPLE_SELECTION:
          return{
              ...state,
              sampleSelection: action.sampleSelection
          }
    default:
      return state

  }
}