import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import ScriptView from '../components/scriptView'
import ScriptEdit from '../components/scriptEdit'
import Home from '../components/home'

const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      <div>
        <Route exact={true} path="/" component={Home} />
        <Route exact={true} path="/new" component={ScriptView} />
        <Route exact={true} path="/:id/edit" component={ScriptEdit} />
        <Route exact={true} path="/:id" component={ScriptView} />
      </div>
    </Router>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired
}

export default Root
