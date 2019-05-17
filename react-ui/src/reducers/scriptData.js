import { fromJS } from 'immutable'

import {
  REQUEST_SCRIPTS,
  REQUEST_SCRIPT,
  RECEIVE_SCRIPTS,
  RECEIVE_SCRIPT,
  SET_CURRENT_SCRIPT,
  SET_CURRENT_EDITING_SCRIPT
} from '../actions'

export const STATE_KEY = 'scriptData'

const initialScriptState = fromJS({loading: false, currentScript: null, currentScriptPersistant: null});

const reducer = (state = initialScriptState, action) => {
  let newState;
  switch (action.type){
    case SET_CURRENT_SCRIPT:
      return state.set('currentScript', action.payload)
    case SET_CURRENT_EDITING_SCRIPT:
      return state.set('currentScriptEditing', true)
    case REQUEST_SCRIPTS:
      return state.set('loading', true)
    case REQUEST_SCRIPT:
        return state.set('loading', true)
    case RECEIVE_SCRIPTS:
      newState = state.set('loading', false)
      newState = newState.mergeDeep(fromJS(action.payload.entities))
      return newState;
    case RECEIVE_SCRIPT:
      newState = state.set('loading', false)
      newState = newState.mergeDeep(fromJS(action.payload.entities))
      console.log('RECEIVE_SCRIPT', newState, action.payload)
      return newState
    default:
      return state
  }
}

export default reducer
