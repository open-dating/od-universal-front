import React from 'react'
import {Provider} from 'react-redux'
import {ConnectedRouter} from 'connected-react-router'

import './App.scss'
import {history, store} from './store'
import {Routes} from './Routes'
import {Static} from './Static'

function App() {
  return (
    <Provider
      store={store}
    >
      <Static/>
      <ConnectedRouter
        history={history}
        children={<Routes/>}
      />
    </Provider>
  )
}

export default App
