import { LOAD_PROTEIN, PROTEIN_IS_LOADED, CHANGE_SAMPLE_SELECTION } from '../actions/const'

const defaultState = {
    proteinAC: 'P02786',
    isLoading: false,
    protein: null,
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
    ]
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
              protein: action.protein,
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