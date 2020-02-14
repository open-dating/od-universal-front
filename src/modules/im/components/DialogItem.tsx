import React from 'react'
import {ListItemAvatar} from '@material-ui/core'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import {useHistory} from 'react-router'

import {ImDialog} from '../../../interfaces/ImDialog'
import {UserProfile} from '../../../interfaces/UserProfile'

export function DialogItem({dialog, user}: { dialog: ImDialog, user: UserProfile|null}) {
  const history = useHistory()
  const lastMessage = dialog.lastMessage
  const otherUser = dialog.users.find(u => u.id !== user?.id)

  return (
    <>
      <ListItem
        dense
        button
        onClick={() => history.push(`/im/dialog/${dialog.id}`)}
        className='dialog-item'
      >
        {lastMessage && (
          <>
            <ListItemAvatar>
              <Avatar
                alt=""
                src={lastMessage.fromUser.photos[0] ? lastMessage.fromUser.photos[0].url : ''}
              />
            </ListItemAvatar>
            <ListItemText
              primary={lastMessage.fromUser.firstname}
              secondary={lastMessage.text ? lastMessage.text : '[photo]'}
            />
          </>
        )}
        {!lastMessage && (
          <>
            <ListItemAvatar>
              <Avatar
                alt=""
                src={otherUser && otherUser.photos[0] ? otherUser.photos[0].url : ''}
              />
            </ListItemAvatar>
            <ListItemText
              primary={otherUser?.firstname}
              secondary=""
            />
          </>
        )}
      </ListItem>
      <Divider/>
    </>
  )
}
