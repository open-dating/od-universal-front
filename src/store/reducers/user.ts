import {StateUser} from '../../interfaces/StateUser'
import {
  USER_DATA_REMOVE,
  USER_DATA_SAVE,
  USER_DATA_ADD_UNREAD_DIALOG,
  USER_DATA_REMOVE_UNREAD_DIALOG,
} from '../actionTypes'
import {JWT} from '../../interfaces/JWT'
import {UserProfile} from '../../interfaces/UserProfile'
import {ImDialog} from '../../interfaces/ImDialog'
import {uniqItems} from '../utils/uniqItems'

const initialUserState: StateUser = localStorage.getItem(USER_DATA_SAVE) ? JSON.parse(localStorage.getItem(USER_DATA_SAVE) as any) : {
  profile: null,
  jwt: null,
}

export const user = (state = initialUserState, {type, jwt, profile, dialog}: {type: string, jwt: JWT, profile: UserProfile, dialog: ImDialog}): StateUser => {
  if (type === USER_DATA_SAVE) {
    const updatedState = Object.assign({}, state)

    if (jwt) {
      updatedState.jwt = jwt
    }
    if (profile) {
      updatedState.profile = profile
    }

    localStorage.setItem(USER_DATA_SAVE, JSON.stringify(updatedState))

    // errorTrack.setUser(updatedState.user)

    return updatedState
  } else if (type === USER_DATA_REMOVE) {
    localStorage.removeItem(USER_DATA_SAVE)

    // errorTrack.setUser(null)

    return {profile: null, jwt: null}
  } else if (type === USER_DATA_ADD_UNREAD_DIALOG) {
    const updatedState = {...state}

    if (!updatedState.profile) {
      return state
    }

    updatedState.profile.unreadDialogs = uniqItems([
      dialog,
      ...updatedState.profile.unreadDialogs,
    ])

    localStorage.setItem(USER_DATA_SAVE, JSON.stringify(updatedState))

    return updatedState
  } else if (type === USER_DATA_REMOVE_UNREAD_DIALOG) {
    const updatedState = {...state}

    if (!updatedState.profile) {
      return state
    }

    updatedState.profile.unreadDialogs = updatedState.profile.unreadDialogs
      .filter(d => d.id !== dialog.id)

    localStorage.setItem(USER_DATA_SAVE, JSON.stringify(updatedState))

    return updatedState
  } else {
    return state
  }
}
