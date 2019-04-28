import {normalizeSequencesData} from '../schema'
import {getSequences} from '../selectors'

export const SET_FILTER_IDS = 'SET_FILTER_IDS'
export const SET_FILTER_EXCLUDE = 'SET_FILTER_EXCLUDE'
export const SET_FILTER_AND = 'SET_FILTER_AND'
export const REQUEST_SEQUENCES = 'REQUEST_SEQUENCES'
export const RECEIVE_SEQUENCES = 'RECEIVE_SEQUENCES'


export const setFilterIds = (name, ids) => ({
    type: SET_FILTER_IDS,
    payload: {
      name: name,
      field: 'ids',
      value: ids
    }
})

export const setFilterExclude = (name, exclude) => ({
    type: SET_FILTER_EXCLUDE,
    payload: {
      name: name,
      field: 'exclude',
      value: exclude
    }
})

export const setFilterAnd = (name, and) => ({
    type: SET_FILTER_EXCLUDE,
    payload: {
      name: name,
      field: 'and',
      value: and
    }
})

export const requestSequences = () => ({
  type: REQUEST_SEQUENCES
})

export const receiveSequences = (data) => {
  return ({
    type: RECEIVE_SEQUENCES,
    payload: data
  })
}

const fetchSequences = () => dispatch => {
  dispatch(requestSequences())
  return fetch(`/sequences`, {
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }})
  .then(res => res.json())
  .then(json => {
    return dispatch(receiveSequences(normalizeSequencesData(json.data)))
  })
}

const shouldFetchSequences = (state) => {
  if(state.sequenceData.getIn(['loading', 'sequence'])){
    return false
  }
  if(!getSequences(state)){
    return true
  }
  return false
}

export const fetchSequencesifNeeded = name => (dispatch, getState) =>{
  if(shouldFetchSequences(getState())){
    return dispatch(fetchSequences())
  }
}
