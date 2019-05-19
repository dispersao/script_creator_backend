import { fromJS } from 'immutable'

import {
  REQUEST_SCRIPTS,
  REQUEST_SCRIPT,
  RECEIVE_SCRIPTS,
  RECEIVE_SCRIPT,
  SET_CURRENT_SCRIPT,
  SCRIPT_CREATED
} from '../actions'

export const STATE_KEY = 'scriptData'

const initialScriptState = fromJS({loading: false, currentScript: null,});

const reducer = (state = initialScriptState, action) => {
  let newState;
  switch (action.type){
    case SET_CURRENT_SCRIPT:
      return state.set('currentScript', action.payload)
    case REQUEST_SCRIPTS:
      return state.set('loading', true)
    case REQUEST_SCRIPT:
        return state.set('loading', true)
    case RECEIVE_SCRIPTS:
      newState = state.mergeDeep(fromJS(action.payload.entities))
      newState = newState.set('loading', false)
      return newState;
    case RECEIVE_SCRIPT:
      newState = state.setIn(['scripts', action.payload.id.toString()], fromJS(action.payload))
      newState = newState.set('loading', false)
      return newState
    case SCRIPT_CREATED:
      newState = state.mergeDeep(fromJS(action.payload.script.entities))
      newState = newState.set('loading', false)
      return newState
    default:
      return state
  }
}

export default reducer
