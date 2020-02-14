import {MESSAGES_UPDATE, MESSAGES_UPDATE_FAIL, MESSAGES_UPDATE_START} from '../actionTypes'
import {get} from '../../services/api/restClient'
import {urlsIm} from '../../services/api/urls'
import {ImMessage} from '../../interfaces/ImMessage'

export const fetchMessages = (
  {token, dialogId, olderThanId}: { token: string|undefined, dialogId: number, olderThanId: number },
) => (dispatch: (arg0: { type: string; dialogId: number; data?: any; error?: any;}) => void) => {
  dispatch({type: MESSAGES_UPDATE_START, dialogId})

  return get(
    urlsIm.messages(dialogId, olderThanId),
    token,
  ).then(r => {
    dispatch({type: MESSAGES_UPDATE, dialogId, data: r.data})
    return r
  }).catch(error => {
    console.error(error)
    dispatch({type: MESSAGES_UPDATE_FAIL, dialogId, error})
    return Promise.reject(error)
  })
}

export const addMessage = (
  {message, dialogId}: { message: ImMessage, dialogId: number },
) => ({
  type: MESSAGES_UPDATE,
  dialogId,
  data: {data:[message]},
})
