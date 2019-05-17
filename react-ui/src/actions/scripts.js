import { normalizeScriptData} from '../schema'
import {getScripts} from '../selectors'
import {scriptsService} from '../utils/feathers-app'
import {scriptToStore} from '../utils/formatToApi'

export const REQUEST_SCRIPTS = 'REQUEST_SCRIPTS'
export const RECEIVE_SCRIPTS = 'RECEIVE_SCRIPTS'
export const REQUEST_SCRIPT = 'REQUEST_SCRIPT'
export const RECEIVE_SCRIPT = 'RECEIVE_SCRIPT'
export const SET_CURRENT_SCRIPT = 'SET_CURRENT_SCRIPT'
export const SET_CURRENT_EDITING_SCRIPT = 'SET_CURRENT_EDITING_SCRIPT'
export const ADD_SEQUENCE_TO_SCRIPT = 'ADD_SEQUENCE_TO_SCRIPT'
export const REMOVE_SEQUENCE_FROM_SCRIPT = 'REMOVE_SEQUENCE_FROM_SCRIPT'
export const CHANGE_SCRIPT_DATA = "CHANGE_SCRIPT_DATA"
export const SAVE_SCRIPT = "SAVE_SCRIPT"
export const REFETCH_SCRIPT = "REFETCH_SCRIPT"
export const SCRIPT_CREATED = 'SCRIPT_CREATED'


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

export const setCurrentScriptAsEditing = (id) => {
  return ({
    type: SET_CURRENT_EDITING_SCRIPT,
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

export const saveScript = (script) => ({
  type: SAVE_SCRIPT,
  payload: {
    script
  }
})

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
    return dispatch(receiveScript(normalizeScriptData([script])))
  })
}

export const removeSequenceFromScript = (script, index) => (dispatch, getState) => {
  dispatch(requestScript())
  const list = getState().scriptData.getIn(['scripts', script.toString(), 'sequences']).delete(index)
  scriptsService.patch(script, {sequences: list.toJS()})
  .then(script => {
    return dispatch(receiveScript(normalizeScriptData([script])))
  })
}

export const changeScriptName = (script, name) => (dispatch, getState) => {
  dispatch(requestScript())
  scriptsService.patch(script, {name: name})
  .then(script => {
    return dispatch(receiveScript(normalizeScriptData([script])))
  })
}

export const fetchScript = (script) => dispatch => {
  dispatch(requestScript(script.id))
  return scriptsService.get(script.id)
  .then(script => {
    return dispatch(receiveScript(normalizeScriptData([script])))
  })
}

export const updateScript = (script) => dispatch => {
  dispatch(saveScript(script.id))
  return scriptsService.patch(script.id, scriptToStore(script))
  .then(result => {
    return dispatch(receiveScript(normalizeScriptData([result])))
  })
}

export const createScript = (script) => dispatch => {
  dispatch(saveScript(script.id))
  return scriptsService.create(script.id, scriptToStore(script))
  .then(result => {
    return dispatch(scriptCreated(normalizeScriptData(script.id, result.data)))
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

const isScriptSynched = (data) => {
  return data.synched;
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

export const updateScriptIfNeeded = (script) => (dispatch, getState) => {
  if(!isScriptSynched(script)){
    return dispatch(updateScript(script))
  }
}

export const refetchScriptIfNeeded = (script) => (dispatch, getState) => {
  if(!isScriptSynched(script)){
    console.log('not synched')
    return dispatch(fetchScript(script))
  } else {
    console.log('synched', normalizeScriptData([scriptToStore(script)]))
    return dispatch(receiveScript(normalizeScriptData([scriptToStore(script)])))
  }
}

// export const changeScriptName = (script, name) => (dispatch, getState) =>{
//   dispatch(changeScriptData(script, 'name', name))
// }


export const setCurrentScriptId = id => (dispatch,getState)=>{
  if(id){
    return dispatch(setCurrentScript(id))
  }
}

export const setCurrentScriptEditing = id => (dispatch, getState) => {
  if(id){
    return dispatch(setCurrentScriptAsEditing(id))
  }
}
