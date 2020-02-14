import {StateMessages} from '../../interfaces/StateMessages'
import {MESSAGES_UPDATE, MESSAGES_UPDATE_FAIL, MESSAGES_UPDATE_START} from '../actionTypes'
import {ImMessage} from '../../interfaces/ImMessage'
import {uniqItems} from '../utils/uniqItems'

const initialMessages: StateMessages = {}

export const messages = (
  state = initialMessages,
  {type, dialogId, data, error}: { type: string, dialogId: number, data?: any, error?: any},
): StateMessages => {
  if (type === MESSAGES_UPDATE_START) {
    const existItem = state[dialogId] || null

    const messagesItem = {
      loading: true,
      error: null,
      dto: {
        data: existItem ? existItem.dto.data : [],
        _meta: data && data._meta ? data._meta : existItem?.dto?._meta,
      },
    }

    return {
      ...state,
      [dialogId]: messagesItem,
    }
  }

  if (type === MESSAGES_UPDATE_FAIL) {
    const existItem = state[dialogId] || null

    const messagesItem = {
      loading: false,
      error,
      dto: {
        data: existItem ? existItem.dto.data : [],
        _meta: data && data._meta ? data._meta : existItem?.dto?._meta,
      },
    }

    return {
      ...state,
      [dialogId]: messagesItem,
    }
  }

  if (type === MESSAGES_UPDATE) {
    const existItem = state[dialogId] || null

    const items = uniqItems([
      ...existItem ? existItem.dto.data : [],
      ...(data.data as ImMessage[]),
    ]).sort((a, b) => a.id - b.id)

    const messagesItem = {
      loading: false,
      error: null,
      dto: {
        data: items,
        _meta: data._meta ? data._meta : existItem?.dto?._meta,
      },
    }

    return {
      ...state,
      [dialogId]: messagesItem,
    }
  }

  return state
}
