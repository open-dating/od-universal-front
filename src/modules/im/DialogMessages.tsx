import React, {useEffect, useRef, useState} from 'react'
import {List} from '@material-ui/core'
import {useDispatch, useSelector} from 'react-redux'
import {useRouteMatch} from 'react-router-dom'
import Container from '@material-ui/core/Container'
import {useTranslation} from 'react-i18next'

import './DialogMessages.scss'
import {post} from '../../services/api/restClient'
import {urlsIm, urlsPhoto} from '../../services/api/urls'
import {StateApp} from '../../interfaces/StateApp'
import {MessageItem} from './components/MessageItem'
import {MessageForm} from './components/MessageForm'
import {ImMessage} from '../../interfaces/ImMessage'
import {addMessage, fetchMessages} from '../../store/actions/messages'
import {markDialogAsRead} from '../../store/actions/dialogs'
import {SpinnerPrefetch} from '../../shared-components/SpinnerPrefetch'
import {StateMessagesItem} from '../../interfaces/StateMessagesItem'
import {ToolbarDialogMessages} from './components/ToolbarDialogMessages'
import {FetchError} from '../../shared-components/FetchError'
import {openMessageBox} from '../../shared-components/MessageBox'

const fetchPrevOnScrollSize = 150

export function DialogMessages() {
  const {t} = useTranslation()
  const userData = useSelector((state: StateApp) => state.user)
  const match = useRouteMatch('/im/dialog/:id')
  const messageListRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()
  const messagesIndex = useSelector((state: StateApp) => state.messages)
  const [fetchOlderThanId, setFetchOlderThanId] = useState(0)
  const [visibleAreaWH, setVisibleAreaWH] = useState([0, 0])
  const scrolledToBtmOnInit = useRef(false)
  const prevMessages = useRef<StateMessagesItem|null>(null)

  const dialogId = Number((match?.params as any)?.id)
  const messages = messagesIndex[dialogId] || null
  const token = userData?.jwt?.accessToken

  const noMessages = messages && !messages.loading && messages.dto.data.length === 0
  const messagesLoading = !messages || (messages && messages.loading)
  const error = messages ? messages.error : null

  useEffect(() => {
    dispatch(fetchMessages({
      token,
      dialogId,
      olderThanId: fetchOlderThanId,
    }))
  }, [dispatch, token, dialogId, fetchOlderThanId])

  // on loaded, scroll to btm and mark as read
  useEffect(() => {
    if (!messageListRef.current) {
      return
    }

    if (messages && !messages.loading) {
      if (!scrolledToBtmOnInit.current) {
        scrolledToBtmOnInit.current = true

        setTimeout(() => {
          if (messageListRef.current) {
            messageListRef.current.scrollTop = 5000000
          }
        })

        dispatch(markDialogAsRead({
          dialogId,
          token,
        }))
      }
    }
  }, [dispatch, token, dialogId, messages, messageListRef, scrolledToBtmOnInit])

  // scroll to new messages
  useEffect(() => {
    if (!messageListRef.current) {
      return
    }

    if (prevMessages.current && messages) {
      const lastPrev = prevMessages.current.dto.data[prevMessages.current.dto.data.length - 1]
      const lastCurr = messages.dto.data[messages.dto.data.length - 1]

      if (lastPrev && lastCurr && lastPrev.id !== lastCurr.id) {
        messageListRef.current.scrollTop = 5000000
        dispatch(markDialogAsRead({
          dialogId,
          token,
        }))
      }
    }

    if (messages) {
      prevMessages.current = {...messages}
    }
  }, [dispatch, messages, dialogId, token])

  // save scroll position
  useEffect(() => {
    if (!messageListRef.current) {
      return
    }

    const scrollGuard = () => {
      if (!messageListRef.current) {
        return
      }

      const scrollTop = messageListRef.current.scrollTop

      // for keep scroll pos, on fetch prev messages
      if (scrollTop < 2) {
        messageListRef.current.scrollTop = 2
        return
      }

      if (scrollTop < fetchPrevOnScrollSize) {
        if (!messagesLoading && !noMessages && messages.dto._meta.minId) {
          setFetchOlderThanId(messages.dto._meta.minId)
        }
      }
    }

    const msgList = messageListRef.current
    msgList.addEventListener('scroll', scrollGuard)

    return () => msgList.removeEventListener('scroll', scrollGuard)
  }, [messagesLoading, noMessages, messages, messageListRef])

  // save w,h for correct calc images resolutions
  useEffect(() => {
    if (!messageListRef.current) {
      return
    }

    setVisibleAreaWH([
      messageListRef.current.clientWidth,
      messageListRef.current.clientHeight,
    ])
  }, [messageListRef])

  const afterSend = (message: ImMessage) => {
    dispatch(addMessage({message, dialogId: message.dialog.id}))
  }

  const sendMessage = (form: any) => {
    return post(urlsIm.sendMessage(), {
      text: form.text,
      dialogId,
      photoId: form.image?.id,
    }, userData?.jwt?.accessToken)
  }

  const uploadImage = (image: File|Blob) => {
    const fd = new FormData()
    fd.append('file', image)
    return post(urlsPhoto.upload(), fd, userData?.jwt?.accessToken)
  }

  if (error && !noMessages) {
    openMessageBox(error)
  }

  return (
    <>
      <ToolbarDialogMessages
        dialog={messages?.dto._meta?.dialog}
      />
      <div className="dialog-messages">
        {messagesLoading && <SpinnerPrefetch/>}
        <div className="dialog-messages__header"/>
        <div className="dialog-messages__messages">
          <div
            className="dialog-messages__messages__wrap"
            ref={messageListRef}
          >
            <Container>
              <List>
                {messages && messages.dto.data.map(message =>
                  <MessageItem
                    key={message.id}
                    message={message}
                    user={userData.profile}
                    visibleAreaWH={visibleAreaWH}
                  />,
                )}
                {!error && noMessages && (
                  <li>{t('im.noMessages')}</li>
                )}
                {error && noMessages && (
                  <FetchError error={error}/>
                )}
              </List>
            </Container>
          </div>
        </div>
        <div className="dialog-messages__form">
          <MessageForm
            uploadImage={uploadImage}
            afterSend={afterSend}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    </>
  )
}
