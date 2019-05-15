import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import ScriptView from '../components/scriptView'
import ScriptEdit from '../components/scriptEdit'
import Home from '../components/home'
import Login from '../components/login'

const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      <div>
        <Route exact={true} path="/login" component={Login}  />
        <PrivateRoute exact={true} path="/scripts" component={Home} getState={store.getState}/>
        <PrivateRoute exact={true} path="/scripts/new" component={ScriptView} getState={store.getState}/>
        <PrivateRoute exact={true} path="/scripts/:id" component={ScriptView} getState={store.getState}/>
        <PrivateRoute exact={true} path="/scripts/:id/edit" component={ScriptEdit} getState={store.getState}/>
      </div>
    </Router>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired
}

const PrivateRoute = ({ component: Component, ...rest })=> {
  return (
    <Route
      {...rest}
      render={props => {
        if(rest.getState().user.get('authenticated')){
          return <Component {...props} />
        } else {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
        }
      }}
      />
    )
}

export default Root
