import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'location-origin'
import 'url-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

// example: https://github.com/i18next/react-i18next/blob/9240736a5464c8c09254d140be82b6eabc07dd97/example/react/src/App.js
// import i18n (needs to be bundled ;))
import './i18n'

import App from './App'
// import * as serviceWorker from './serviceWorker'

ReactDOM.render(<App/>, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
