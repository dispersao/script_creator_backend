import { fromJS } from 'immutable'

import {
  AUTHENTICATE,
  RECEIVE_USER,
  AUTHENTICATION_ERROR
} from '../actions'

export const STATE_KEY = 'user'

const initialScriptState = fromJS({loading: false, authenticated: false, name: '', email: '', authentication_error:null});

const reducer = (state = initialScriptState, action) => {
  switch (action.type){
    case AUTHENTICATE:
      state = state.mergeDeep(fromJS({loading: true, authentication_error:null}))
      console.log(state)
      return state;
    case AUTHENTICATION_ERROR:
      return state.set('authentication_error', action.payload)
    case RECEIVE_USER:
     const data = {
       ...action.payload,
       loading: false,
       authenticated: true,
       authentication_error: null
     }
      return state.mergeDeep(fromJS(data))
    default:
      return state
  }
}

export default reducer
