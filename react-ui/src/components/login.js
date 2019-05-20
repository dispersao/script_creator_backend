import React, {useRef, useEffect} from 'react'
import Spinner from 'react-bootstrap/Spinner'
import {toJS} from '../utils/immutableToJS'
import {connect} from 'react-redux'
import {authenticateIfNeeded} from '../actions'
import {getLogedUser} from '../selectors'
import { Redirect } from 'react-router-dom'

import {Button, Form} from 'react-bootstrap'

const LoginComp = ({authenticate, user, location}) => {
  const emailEl = useRef(null);
  const passEl = useRef(null);

  useEffect(() => {
    if(!user.authenticated && !user.loading && !user.authentication_error){
      authenticate();
    }
  });

  const onSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    authenticate({
      email: emailEl.current.value,
      password: passEl.current.value
    });
  };

  if(user.authenticated){
    let {from} = location.state && location.state.from.pathname !== '/login' ? location.state : { from: { pathname: "/script" }};
    return <Redirect to={from} />
  } else if (user.loading){
    return(
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    )
  } else {
    return (
      <div>
      <Form onSubmit={onSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control autoComplete="username" type="email" placeholder="Enter email" ref={emailEl}/>
          <Form.Text className="text-muted">
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control autoComplete="current-password" type="password" placeholder="Password" ref={passEl} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
        </Form>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  authenticate: (userdata)=> {
    dispatch(authenticateIfNeeded(userdata))
  }
})

const mapStateToProps = (state, props) => {
  console.log(state)
  return {user: getLogedUser(state)}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(LoginComp))
