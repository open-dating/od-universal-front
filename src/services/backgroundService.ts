import {Store} from 'redux'

import {StateUser} from '../interfaces/StateUser'
import {connectAndListenSocket, disconnectSocket} from './socket'
import {registerInFCMAndGetToken, saveFCMToken} from './fcm'
import {listenLocationChange} from './geoLocation'

let prevUserData: StateUser|null = null

function checkSocket(userData: StateUser) {
  const accessToken = userData.jwt?.accessToken

  if (accessToken) {
    connectAndListenSocket(accessToken)
  } else {
    disconnectSocket()
  }
}

function checkFCM(userData: StateUser) {
  const accessToken = userData.jwt?.accessToken

  registerInFCMAndGetToken().then(() => {
    saveFCMToken(accessToken)
  }).catch(e => {
    console.warn('Cant get and save fcm token')
    console.error(e)
  })
}

export function runBackgroundService(store: Store) {
  // listen for changes
  store.subscribe(() => {
    const userData: StateUser = store.getState().user

    if (prevUserData !== userData) {
      // actions only if user re logged
      if (prevUserData?.jwt?.accessToken !== userData?.jwt?.accessToken) {
        checkSocket(userData)
        checkFCM(userData)
        listenLocationChange(userData.jwt?.accessToken || '')
      }
    }

    prevUserData = userData
  })

  // run on init
  const userData: StateUser = store.getState().user

  checkSocket(userData)

  checkFCM(userData)

  listenLocationChange(userData.jwt?.accessToken || '')
}
