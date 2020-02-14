import {USER_DATA_REMOVE, USER_DATA_SAVE} from '../actionTypes'
import {UserProfile} from '../../interfaces/UserProfile'
import {JWT} from '../../interfaces/JWT'
import {get} from '../../services/api/restClient'
import {urlsUser} from '../../services/api/urls'
import {removeFCMToken} from '../../services/fcm'

export const saveUserData = ({profile, jwt}: {profile?: UserProfile, jwt?: JWT}) => ({
  type: USER_DATA_SAVE,
  profile,
  jwt,
})

export const removeUserData = (token: string) => (dispatch: (arg0: { type: string }) => any) => {
  removeFCMToken(token)

  return dispatch({type: USER_DATA_REMOVE})
}

export const fetchUserData = (
  {token}: { token: string },
) => (dispatch: (arg0: { type: string; profile: any; }) => void) => {
  return get(urlsUser.myProfile(), token).then(r => {
    dispatch({
      type: USER_DATA_SAVE,
      profile: r.data,
    })
    return r
  }).catch(error => {
    console.error(error)
    return Promise.reject(error)
  })
}
