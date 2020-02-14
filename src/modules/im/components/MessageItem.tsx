import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import {Link} from 'react-router-dom'

import './MessageItem.scss'
import {UserProfile} from '../../../interfaces/UserProfile'
import {ImMessage} from '../../../interfaces/ImMessage'

const useStyles = makeStyles(theme => ({
  card: {},
  cardMyMessage: {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.contrastText,
  },
}))

const getWHRelativeToScrWidth = (width = 100, height = 100, visibleAreaWH = [0, 0]) => {
  const [w, h] = visibleAreaWH
  const coef = 0.8

  let r = 1
  if (height > h * coef) {
    r = height / (h * coef)
  }
  if (width > w * coef) {
    const nextR = width / (w * coef)
    if (nextR > r) {
      r = nextR
    }
  }

  return [Math.round(width / r), Math.round(height / r)]
}

export function MessageItem({user, message, visibleAreaWH}: {user: UserProfile|null, message: ImMessage, visibleAreaWH: number[]}) {
  const classes = useStyles()
  const [showNotSafe, setShowNotSafe] = React.useState(false)
  const fromUser = message.fromUser

  const isMyMessage = fromUser.id === user?.id
  const notSafe = message.photo && message.photo.isNSFW

  const [w, h] = message.photo && message.photo.url
    ? getWHRelativeToScrWidth(message.photo.width, message.photo.height, visibleAreaWH)
    : [0, 0]

  const htmlMessage = String(message.text || '')
    .split('\n')
    .join('<br>')

  return (
    <div className={
      `message-item ${isMyMessage ? 'message-item--my-message' : ''}`
    }>
      {!isMyMessage && (<div className="message-item__avatar">
        <Link to={`/user/profile/${message.fromUser.id}`}>
          <Avatar
            alt=""
            src={message.fromUser.photos[0].url}
          />
        </Link>
      </div>)}
      <div className={
        message.photo && message.photo.url
          ? 'message-item__message message-item__message--has-image'
          : 'message-item__message'
      }>
        <Card className={isMyMessage ? classes.cardMyMessage : classes.card}>
          <CardContent className="message-item__message__content">
            {message.photo && message.photo.url && (
              <div
                className={
                  `message-item__message__content__image
                  ${notSafe ? 'message-item__message__content__image--nsfw' : ''}
                  ${showNotSafe ? 'message-item__message__content__image--nsfw-show' : ''}`
                }
              >
                <img
                  src={`${message.photo.url}`}
                  alt=""
                  width={w}
                  height={h}
                />
                {notSafe && (
                  <Button
                    className="message-item__message__content__image__toggle"
                    onClick={() => setShowNotSafe(!showNotSafe)}
                  >{showNotSafe ? 'Hide' : 'Show'}</Button>)
                }
                {notSafe && (
                  <div className="message-item__message__content__image__caption">
                    Is NSFW image and is hidden now
                  </div>
                )}
              </div>
            )}
            {message.text && (
              <div
                className="message-item__message__content__text"
                dangerouslySetInnerHTML={{__html: htmlMessage}}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
