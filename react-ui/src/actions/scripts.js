import { normalizeScriptList, normalizeScript} from '../schema'
import {getScripts, getFilteredSequences} from '../selectors'
import {scriptsService} from '../utils/feathers-app'
import {getRandomScriptSequences} from '../utils/scriptUtils'
import history from '../utils/history'

export const REQUEST_SCRIPTS = 'REQUEST_SCRIPTS'
export const RECEIVE_SCRIPTS = 'RECEIVE_SCRIPTS'
export const REQUEST_SCRIPT = 'REQUEST_SCRIPT'
export const RECEIVE_SCRIPT = 'RECEIVE_SCRIPT'
export const SET_CURRENT_SCRIPT = 'SET_CURRENT_SCRIPT'
export const SCRIPT_CREATED = "SCRIPT_CREATED"


export const requestScripts = () => ({
  type: REQUEST_SCRIPTS
})

export const requestScript = (script) => ({
  type: REQUEST_SCRIPTS,
  payload: {
    script
  }
})

export const receiveScripts = (data) => {
  return ({
    type: RECEIVE_SCRIPTS,
    payload: data
  })
}

export const receiveScript = (data) => {
  return ({
    type: RECEIVE_SCRIPT,
    payload: data
  })
}

export const setCurrentScript = (id) => {
  return ({
    type: SET_CURRENT_SCRIPT,
    payload: id
  })
}


export const scriptCreated = (id, script) => ({
  type: SCRIPT_CREATED,
  payload: {
    script,
    id
  }
})

export const addSequenceToScript = (script, sequence, index) => (dispatch, getState) => {
  const list = getState().scriptData.getIn(['scripts', script.toString(), 'sequences']).insert(index,sequence)
  scriptsService.patch(script, {sequences:list.toJS()})
  .then(script => {
    return dispatch(receiveScript(script))
  })
}

export const removeSequenceFromScript = (script, index) => (dispatch, getState) => {
  dispatch(requestScript())
  const list = getState().scriptData.getIn(['scripts', script.toString(), 'sequences']).delete(index)
  scriptsService.patch(script, {sequences: list.toJS()})
  .then(script => {
    return dispatch(receiveScript(script))
  })
}

export const changeScriptName = (script, name) => (dispatch, getState) => {
  dispatch(requestScript())
  scriptsService.patch(script, {name})
  .then(script => {
    return dispatch(receiveScript(script))
  })
}


export const createScript = (name) => dispatch => {
  dispatch(requestScript())
  return scriptsService.create({name})
  .then(script => {
    return dispatch(scriptCreated(script.id, normalizeScriptList([script])))
  })
  .then((s)=>{
    history.push(`/script/${s.payload.id}/edit`)
  })
}

export const createRandomScript = (script, total) => (dispatch, getState) => {
  const filteredSequences = getFilteredSequences(getState())
  const sequences = getRandomScriptSequences(filteredSequences.toJS(), parseInt(total))
  dispatch(requestScript())
  return scriptsService.patch(script, {sequences})
  .then(script => {
    return dispatch(receiveScript(script))
  })
}

const shouldFetchScripts = (state) => {
  if(state.scriptData.getIn(['loading', 'scripts'])){
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
    return dispatch(receiveScripts(normalizeScriptList(scripts.data)))
  })
}

export const fetchScriptsIfNeeded = name => (dispatch, getState) =>{
  if(shouldFetchScripts(getState())){
    return dispatch(fetchScripts())
  }
}

export const setCurrentScriptId = id => (dispatch,getState)=>{
  if(id){
    return dispatch(setCurrentScript(id))
  }
}
