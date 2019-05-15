import {authenticate} from '../utils/feathers-app';

export const AUTHENTICATE = 'AUTHENTICATE'
export const RECEIVE_USER = 'RECEIVE_USER'


export const requestAuthentication = () => ({
  type: AUTHENTICATE
})

export const receiveUser = (data) => {
  return ({
    type: RECEIVE_USER,
    payload: data
  })
}

const shouldAuthenticate = (state) => {
  if(false){
    return false;
  }
  return true;
}

const fetchToken = ({email, password}) => dispatch => {
  dispatch(requestAuthentication())
  return authenticate({
    email,
    password,
    strategy: 'local'
  })
  .then(user => {
    return dispatch(receiveUser(user))
  })
}

export const authenticateIfNeeded = authData => (dispatch, getState) =>{
  if(shouldAuthenticate(getState())){
    return dispatch(fetchToken(authData))
  }
}
