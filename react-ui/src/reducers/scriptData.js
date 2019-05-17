import { fromJS } from 'immutable'

import {
  REQUEST_SCRIPTS,
  REQUEST_SCRIPT,
  RECEIVE_SCRIPTS,
  RECEIVE_SCRIPT,
  SET_CURRENT_SCRIPT,
  ADD_SEQUENCE_TO_SCRIPT,
  REMOVE_SEQUENCE_FROM_SCRIPT,
  CHANGE_SCRIPT_DATA,
  SET_CURRENT_EDITING_SCRIPT
} from '../actions'

export const STATE_KEY = 'scriptData'

const initialScriptState = fromJS({loading: false, currentScript: null, currentScriptPersistant: null});

const reducer = (state = initialScriptState, action) => {
  let entities, newState;
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
      entities = setScriptInitialvalues(action.payload.entities.scripts)
      console.log(entities)
      return newState.mergeDeep(fromJS({scripts: entities}))
    case RECEIVE_SCRIPT:
      newState = state.set('loading', false)
      entities = setScriptInitialvalues(action.payload.entities.scripts)
      newState = removeSynchedCopy(newState)
      console.log(entities)
      return newState.mergeDeep(fromJS({scripts: entities}))
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
  const newState = makeSynchedCopy(state, script)
  const newSeqList = state.getIn(['scripts', script.toString(), 'sequences']).insert(index,sequence)
  return newState.setIn(['scripts', script.toString(), 'sequences'], newSeqList)
}

function removeSequenceFromScript(state, {index, script}) {
  const newState = makeSynchedCopy(state, script)
  return newState.removeIn(['scripts', script.toString(), 'sequences', index])
}

function setScriptData(state, {script, field, value}){
  const newState = makeSynchedCopy(state, script)
  return newState.setIn(['scripts', script.toString(), field], value)
}

function makeSynchedCopy(state, script) {
  if(!state.get('currentScriptPersistant')){
    state = state.set('currentScriptPersistant', fromJS(state.getIn(['scripts', script.toString()])))
  }
  return state;
}

function removeSynchedCopy(state) {
  state = state.set('currentScriptEditing', false)
  return state.set('currentScriptPersistant', null)
}

function setScriptInitialvalues(scriptEntries){
  Object.keys(scriptEntries).forEach(key => {
    scriptEntries[key].synched = true
    scriptEntries[key].new = false
  })
  console.log(scriptEntries)
  return scriptEntries;
}

export default reducer
