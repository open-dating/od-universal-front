import {ImDialog} from '../../interfaces/ImDialog'
import {
  DIALOGS_CREATE_OR_UPDATE, DIALOGS_MARK_AS_READ,
  DIALOGS_UPDATE, DIALOGS_UPDATE_FAIL,
  DIALOGS_UPDATE_START,
  USER_DATA_ADD_UNREAD_DIALOG,
  USER_DATA_REMOVE_UNREAD_DIALOG,
} from '../actionTypes'
import {get, patch} from '../../services/api/restClient'
import {urlsIm} from '../../services/api/urls'

export const fetchDialogs = (
  {token, userId, nextSkip}: { token: string|undefined, userId: number, nextSkip: number },
) => (dispatch: (arg0: { type: string; data?: any; error?: any; }) => void) => {
  dispatch({type: DIALOGS_UPDATE_START})

  return get(
    urlsIm.dialogs(userId, nextSkip),
    token,
  ).then(r => {
    dispatch({type: DIALOGS_UPDATE, data: r.data})
    return r
  }).catch(error => {
    console.error(error)
    dispatch({type: DIALOGS_UPDATE_FAIL, error})
    return Promise.reject(error)
  })
}


export const createOrUpdateDialog = (
  {dialog}: {dialog: ImDialog},
) => ({
  type: DIALOGS_CREATE_OR_UPDATE,
  dialog,
})

export const markDialogAsRead = (
  {dialogId, token}: {dialogId: number, token: string|undefined},
) => (dispatch: (arg0: { type: string; dialogId: number; }) => void) => {
  return patch(urlsIm.markAsRead(dialogId), null, token).then(r => {
    dispatch({type: DIALOGS_MARK_AS_READ, dialogId})
    return r
  }).catch(error => {
    console.error(error)
    return Promise.reject(error)
  })
}


export const addUnreadDialog = ({dialog}: {dialog: ImDialog}) => ({
  type: USER_DATA_ADD_UNREAD_DIALOG,
  dialog,
})

export const removeUnreadDialog = ({dialog}: {dialog: ImDialog}) => ({
  type: USER_DATA_REMOVE_UNREAD_DIALOG,
  dialog,
})
