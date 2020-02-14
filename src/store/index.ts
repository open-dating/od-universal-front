import {createBrowserHistory} from 'history'
import thunkMiddleware from 'redux-thunk'
import {applyMiddleware, combineReducers, compose, createStore} from 'redux'
import {connectRouter, routerMiddleware} from 'connected-react-router'

import {user} from './reducers/user'
import {join} from './reducers/join'
import {tour} from './reducers/tour'
import {dialogs} from './reducers/dialogs'
import {messages} from './reducers/messages'

const reducer = (history: any) => combineReducers({
  router: connectRouter(history),
  user,
  join,
  tour,
  dialogs,
  messages,
})

export const history = createBrowserHistory()

export const store = createStore(
  reducer(history),
  compose(
    applyMiddleware(
      routerMiddleware(history),
      thunkMiddleware,
    ),
    (window as any).devToolsExtension ? (window as any).devToolsExtension() : (f: any) => f,
  ),
)
