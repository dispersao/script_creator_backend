import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
// import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reducer from './reducers'
import Root from './router'

const middleware = [ thunkMiddleware ]
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

const store = createStore(
  reducer,
  applyMiddleware(...middleware)
)

render(
  <Root store={store} />,
  document.getElementById('root')
)
