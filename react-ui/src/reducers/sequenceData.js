import { fromJS } from 'immutable'

import {
  REQUEST_SEQUENCES,
  RECEIVE_SEQUENCES,
} from '../actions'

export const STATE_KEY = 'sequenceData'

const initialSequencesState = fromJS({loading:  false});

const reducer = (state = initialSequencesState, action) => {
  switch (action.type){
    case REQUEST_SEQUENCES:
      return state.set('loading', true)
    case RECEIVE_SEQUENCES:
      let newState = state.set('loading', false)
      return newState.mergeDeep(fromJS(action.payload.entities))
    default:
      return state
  }
}


export default reducer
