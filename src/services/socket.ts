import io from 'socket.io-client'

import {HOST} from '../config/config'
import {store} from '../store'
import {ImMessage} from '../interfaces/ImMessage'
import {WsOutEvent} from '../enums/ws-out-event.enum'
import {ImDialog} from '../interfaces/ImDialog'
import {addMessage} from '../store/actions/messages'
import {addUnreadDialog, createOrUpdateDialog, removeUnreadDialog} from '../store/actions/dialogs'

let socket: SocketIOClient.Socket|null

export function connectAndListenSocket(token: string) {
  if (socket) {
    return
  }

  socket = io(`${HOST}/?token=${token}`, {
    path: '/api/v1/ws',
  })

  socket.on(WsOutEvent.ImNewMessage, function (data: ImMessage) {
    store.dispatch(addMessage({
      message: data,
      dialogId: data.dialog.id,
    }))
  })

  socket.on(WsOutEvent.ImDialog, function (dialog: ImDialog) {
    store.dispatch(createOrUpdateDialog({
      dialog,
    }))
  })

  socket.on(WsOutEvent.ImUnreadDialog, function (dialog: ImDialog) {
    store.dispatch(addUnreadDialog({
      dialog,
    }))
  })

  socket.on(WsOutEvent.ImUnreadDialogRemove, function (dialog: ImDialog) {
    store.dispatch(removeUnreadDialog({
      dialog,
    }))
  })
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
