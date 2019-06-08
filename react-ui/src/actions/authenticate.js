import {authenticate} from '../utils/feathers-app';

export const AUTHENTICATE = 'AUTHENTICATE'
export const RECEIVE_USER = 'RECEIVE_USER'
export const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR'


export const requestAuthentication = () => ({
  type: AUTHENTICATE
})

export const receiveUser = (data) => {
  return ({
    type: RECEIVE_USER,
    payload: data
  })
}

export const authenticationError = (error) => {
  return ({
    type: AUTHENTICATION_ERROR,
    payload: error
  })
}

const shouldAuthenticate = (state) => {
  if(false){
    return false;
  }
  return true;
}

const fetchToken = (userData) => dispatch => {
  dispatch(requestAuthentication())
  return authenticate(userData)
  .then(user => {
    return dispatch(receiveUser(user))
  })
  .catch(error => {
    return dispatch(authenticationError(error))
  })
}

export const authenticateIfNeeded = authData => (dispatch, getState) =>{
  if(shouldAuthenticate(getState())){
    return dispatch(fetchToken(authData))
  }
}
