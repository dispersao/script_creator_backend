import { fromJS } from 'immutable'

import {
  AUTHENTICATE,
  RECEIVE_USER,
} from '../actions'

export const STATE_KEY = 'user'

const initialScriptState = fromJS({loading: false, authenticated: false, name: '', email: '', token:''});

const reducer = (state = initialScriptState, action) => {
  switch (action.type){
    case AUTHENTICATE:
      return state.set('loading', true)
    case RECEIVE_USER:
      let newState = state.set('loading', false)
      newState = newState.set('authenticated', true)
      return newState.mergeDeep(fromJS(action.payload))
    default:
      return state
  }
}

export default reducer
