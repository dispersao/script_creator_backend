import React, {useRef, useState} from 'react'
import {toJS} from '../utils/immutableToJS'
import {connect} from 'react-redux'
import {authenticateIfNeeded} from '../actions'
import {getLogedUser} from '../selectors'
import { Redirect } from 'react-router-dom'



import {Button, Form} from 'react-bootstrap'

const LoginComp = ({authenticate, user, location}) => {
  const emailEl = useRef(null);
  const passEl = useRef(null);

  const onSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    authenticate(emailEl.current.value, passEl.current.value)
  };
  if(user.authenticated){
    let {from} = location.state && location.state.from.pathname !== '/login' ? location.state : { from: { pathname: "/scripts" }};
    return <Redirect to={from} />
  } else{
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
  authenticate: (email, password)=> {
    dispatch(authenticateIfNeeded({
      email,
      password
    }))
  }
})

const mapStateToProps = (state, props) => ({
  user: getLogedUser(state)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(LoginComp))
