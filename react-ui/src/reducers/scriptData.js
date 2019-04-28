import { fromJS } from 'immutable'

import {
  REQUEST_SCRIPTS,
  RECEIVE_SCRIPTS,
  SET_CURRENT_SCRIPT,
  ADD_SEQUENCE_TO_SCRIPT,
  REMOVE_SEQUENCE_FROM_SCRIPT,
  CHANGE_SCRIPT_DATA
} from '../actions'

export const STATE_KEY = 'scriptData'

const initialScriptState = fromJS({loading: false, currentScript: null});

const reducer = (state = initialScriptState, action) => {
  switch (action.type){
    case SET_CURRENT_SCRIPT:
      return state.set('currentScript', action.payload)
    case REQUEST_SCRIPTS:
      return state.set( 'loading', true)
    case RECEIVE_SCRIPTS:
      let newState = state.set('loading', false)
      return newState.mergeDeep(fromJS(action.payload.entities))
    case ADD_SEQUENCE_TO_SCRIPT:
      return includeNewSequenceToScript(state, action.payload)
    case REMOVE_SEQUENCE_FROM_SCRIPT:
      return removeSequenceFromScript(state, action.payload)
    case CHANGE_SCRIPT_DATA:
      return setScriptData(state, action.payload)
    default:
      return state
  }
}

function includeNewSequenceToScript (state, {index, sequence, script}) {
  const newSeqList = state.getIn(['scripts', script.toString(), 'sequences']).insert(index,sequence)
  return state.setIn(['scripts', script.toString(), 'sequences'], newSeqList)
}

function removeSequenceFromScript(state, {index, script}) {
  return state.removeIn(['scripts', script.toString(), 'sequences', index])
}

function setScriptData(state, {script, field, value}){
  return state.setIn(['scripts', script.toString(), field], value)
}

export default reducer
