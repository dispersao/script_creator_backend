import { normalizeScriptList} from '../schema'
import {getScripts} from '../selectors'
import {scriptsService} from '../utils/feathers-app'
import {scriptToStore} from '../utils/formatToApi'

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


export const scriptCreated = (oldId, script) => ({
  type: SCRIPT_CREATED,
  payload: {
    oldId,
    script
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
  scriptsService.patch(script, {name: name})
  .then(script => {
    return dispatch(receiveScript(script))
  })
}


export const createScript = (script) => dispatch => {
  // dispatch(saveScript(script.id))
  return scriptsService.create(script.id, scriptToStore(script))
  .then(result => {
    return dispatch(scriptCreated(normalizeScriptList(script.id, result.data)))
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
