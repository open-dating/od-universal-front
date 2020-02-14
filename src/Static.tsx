import React, {useEffect} from 'react'

import {store} from './store'
import {StateUser} from './interfaces/StateUser'
import {useDispatch} from 'react-redux'
import {fetchUserData} from './store/actions/user'
import {runBackgroundService} from './services/backgroundService'

export function Static() {
  const dispatch = useDispatch()

  const userData: StateUser = store.getState().user
  const token = userData.jwt?.accessToken

  // fetch user profile on app mount
  useEffect(() => {
    if (token) {
      dispatch(fetchUserData({token}))
    }
  }, [dispatch, token])

  // connect to socket, grab fcm and etc, on app mount
  runBackgroundService(store)

  // singltone components
  return (<></>)
}
