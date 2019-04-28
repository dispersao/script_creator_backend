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


function includeNewSequenceToScript (state, {index, sequence, script}) {
  const newSeqList = state.get('sequences').insert(index,sequence)
  return state.set('sequences', newSeqList)
}

function includeNewSequenceToScriptOld (state, {index, sequence, script}) {
let id = Math.round(Math.random()*100000)
  let newScriptSequence = fromJS({
    [id]: {
      id: id,
      sequenceId: sequence,
      scriptId: parseInt(script)
    }
  })

  let scriptSequencesList = state.get('scriptSequences').merge(newScriptSequence)
  let newState = state.set('scriptSequences', scriptSequencesList)
  let seqList = newState.getIn(['scripts', script.toString(),'scriptSequences']).insert(index,id)
  newState = newState.setIn(['scripts', script.toString(),'scriptSequences'], seqList)
  return newState;
}

function removeSequenceFromScript(state, {index, script}) {
  // return state.removeIn(['scripts', script.toString(), 'scriptSequences', index])
  return state.removeIn(['scripts', script.toString(), 'scriptSequences', index])
}

function setScriptData(state, {script, field, value}){
  return state.setIn(['scripts', script.toString(), field], value)
}

export default reducer
