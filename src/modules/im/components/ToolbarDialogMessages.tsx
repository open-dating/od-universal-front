import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import {useHistory} from 'react-router'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import CircularProgress from '@material-ui/core/CircularProgress'
import Avatar from '@material-ui/core/Avatar'

import {ImDialog} from '../../../interfaces/ImDialog'
import {Complaint} from '../../../shared-components/Complaint'
import {StateApp} from '../../../interfaces/StateApp'
import './ToolbarDialogMessages.scss'
import {patch} from '../../../services/api/restClient'
import {openMessageBox} from '../../../shared-components/MessageBox'
import {urlsIm} from '../../../services/api/urls'
import {MessageBoxType} from '../../../enums/message-box-type.enum'

export function ToolbarDialogMessages({dialog}: {dialog?: ImDialog}) {
  const userData = useSelector((state: StateApp) => state.user)
  const history = useHistory()
  const [sending, setSending] = useState(false)
  const [showComplaint, setShowComplaint] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const opponent = dialog?.users.find(u => u.id !== userData.profile?.id)

  const closeComplaint = () => {
    setShowComplaint(false)
  }

  const openComplaint = () => {
    closeMenu()
    setShowComplaint(true)
  }

  const block = async () => {
    try {
      closeMenu()
      setSending(true)

      await patch(urlsIm.blockDialog(Number(dialog?.id)), {}, userData.jwt?.accessToken)

      openMessageBox('Dialog was blocked', MessageBoxType.success)

      goBack()
    } catch (e) {
      console.error(e)
      openMessageBox(e)
      setSending(false)
    }
  }

  const goBack = () => {
    history.push('/im/dialogs')
  }

  const goToOpponentProfile = () => {
    history.push(`/user/profile/${opponent?.id}`)
  }

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  return (
    <div className="toolbar-dialog-message">
      <Toolbar className="toolbar-dialog-message__bar">
        <IconButton
          edge="start"
          color="inherit"
          onClick={goBack}
        >
          <ArrowBackIcon/>
        </IconButton>
        <div
          className="toolbar-dialog-message__bar__title"
        >
          <Typography
            variant="h6"
            className="toolbar-dialog-message__bar__title__opponent"
          >
            {opponent && opponent.firstname}
            {!opponent && '...'}
          </Typography>
          {opponent && (
            <Avatar
              alt=""
              onClick={goToOpponentProfile}
              src={opponent.photos[0].url}
            />
          )}
        </div>
        {opponent && (
          <>
            <IconButton
              edge="end"
              color="inherit"
              onClick={openMenu}
            >
              {sending ? <CircularProgress color="secondary"/> : <MoreVertIcon/>}
            </IconButton>
            <Menu
              keepMounted
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={closeMenu}
            >
              <MenuItem onClick={openComplaint}>Complaint</MenuItem>
              <MenuItem onClick={block}>Block</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
      {showComplaint && opponent && (<Complaint
        user={opponent}
        dialogId={dialog?.id}
        onDoneCb={() => {
          closeComplaint()
        }}
        onDismissCb={closeComplaint}
      />)}
    </div>
  )
}
