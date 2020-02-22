import React from 'react'
import {Provider} from 'react-redux'
import {ConnectedRouter} from 'connected-react-router'
import {IntlProvider} from 'react-intl'
import {useTranslation} from 'react-i18next'

import './App.scss'
import {history, store} from './store'
import {Routes} from './Routes'
import {Static} from './Static'

function App() {
  const {i18n} = useTranslation()

  return (
    <Provider
      store={store}
    >
      <IntlProvider locale={i18n.language}>
        <Static/>
        <ConnectedRouter
          history={history}
          children={<Routes/>}
        />
      </IntlProvider>
    </Provider>
  )
}

export default App
