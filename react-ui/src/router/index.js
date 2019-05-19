import React from 'react'
import history from '../utils/history'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Router, Route, Redirect } from 'react-router-dom'
import ScriptView from '../components/scriptView'
import ScriptEdit from '../components/scriptEdit'
import Home from '../components/home'
import Login from '../components/login'

const Root = ({ store }) => (
  <Provider store={store}>
    <Router history={history}>
      <div>
        <Route exact={true} path="/login" component={Login}  />
        <PrivateRoute exact={true} path="/script" component={Home} getState={store.getState}/>
        <PrivateRoute exact={true} path="/script/new" component={ScriptView} getState={store.getState}/>
        <PrivateRoute exact={true} path="/script/:id" component={ScriptView} getState={store.getState}/>
        <PrivateRoute exact={true} path="/script/:id/edit" component={ScriptEdit} getState={store.getState}/>
      </div>
    </Router>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired
}

const PrivateRoute = ({ component: Component, ...rest })=> {
  return (
    <Route exact={true}
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
