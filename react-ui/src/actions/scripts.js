import { normalizeScriptData} from '../schema'
import {getScripts} from '../selectors'
import {scriptsService} from '../utils/feathers-app'

export const REQUEST_SCRIPTS = 'REQUEST_SCRIPTS'
export const RECEIVE_SCRIPTS = 'RECEIVE_SCRIPTS'
export const SET_CURRENT_SCRIPT = 'SET_CURRENT_SCRIPT'
export const ADD_SEQUENCE_TO_SCRIPT = 'ADD_SEQUENCE_TO_SCRIPT'
export const REMOVE_SEQUENCE_FROM_SCRIPT = 'REMOVE_SEQUENCE_FROM_SCRIPT'
export const CHANGE_SCRIPT_DATA = "CHANGE_SCRIPT_DATA"

export const requestScripts = () => ({
  type: REQUEST_SCRIPTS
})

export const receiveScripts = (data) => {
  return ({
    type: RECEIVE_SCRIPTS,
    payload: data
  })
}

export const setCurrentScript = (id) => {
  return ({
    type: SET_CURRENT_SCRIPT,
    payload: id
  })
}

export const addSequenceToScriptAt = (script, sequence, index) => ({
  type: ADD_SEQUENCE_TO_SCRIPT,
  payload: {
    index,
    sequence,
    script
  }
})

export const removeSequenceFromScriptAt = (script, index) => ({
  type: REMOVE_SEQUENCE_FROM_SCRIPT,
  payload: {
    index,
    script
  }
})

export const changeScriptData = (script, field, value) => ({
  type: CHANGE_SCRIPT_DATA,
  payload: {
    script,
    field,
    value
  }
})

const shouldFetchScripts = (state) => {
  if(state.sequenceData.getIn(['loading', 'scripts'])){
    return false
  }
  if(!getScripts(state)){
    return true
  }
  return false
}

const fetchScripts = () => dispatch => {
  dispatch(requestScripts())
  return scriptsService.find()
  .then(scripts => {
    return dispatch(receiveScripts(normalizeScriptData(scripts.data)))
  })
}

export const fetchScriptsIfNeeded = name => (dispatch, getState) =>{
  if(shouldFetchScripts(getState())){
    return dispatch(fetchScripts())
  }
}

export const changeScriptName = (script, name) => (dispatch, getState) =>{
  dispatch(changeScriptData(script, 'name', name))
}

export const changeScriptAuthor = (script, name) => (dispatch, getState) =>{
  dispatch(changeScriptData(script, 'author', name))
}

export const setCurrentScriptId = id => (dispatch,getState)=>{
  if(id){
    return dispatch(setCurrentScript(id))
  }
}
