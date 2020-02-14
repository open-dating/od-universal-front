import React, {useState} from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'

import {post} from '../services/api/restClient'
import {useSelector} from 'react-redux'
import {urlsComplaint} from '../services/api/urls'
import {UserProfile} from '../interfaces/UserProfile'
import {StateApp} from '../interfaces/StateApp'
import {openMessageBox} from './MessageBox'
import {MessageBoxType} from '../enums/message-box-type.enum'

export function Complaint(
  {
    user,
    dialogId,
    onDoneCb,
    onDismissCb,
  }: {
    user: UserProfile,
    dialogId?: number,
    onDoneCb: () => void,
    onDismissCb: () => void
  },
) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    message: '',
  })
  const userData = useSelector((state: StateApp) => state.user)


  const handleChange = (event: React.BaseSyntheticEvent) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async () => {
    if (loading) {
      return
    }

    try {
      setLoading(true)

      await post(
        urlsComplaint.create(),
        {
          toUserId: user.id,
          text: String(form.message),
          dialogId: dialogId || 0,
          location: window.location.pathname,
        },
        userData.jwt?.accessToken,
      )

      openMessageBox('Complaint was sent', MessageBoxType.success)
      setLoading(false)
      onDoneCb()
    } catch (e) {
      console.error(e)
      setLoading(false)
      openMessageBox(e)
    }
  }

  return (
    <Dialog
      open={true}
      onClose={onDismissCb}
    >
      <DialogTitle>Complaint</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can indicate what we should pay attention to,
          to apply penalties either
          ban user {user.firstname}
        </DialogContentText>
        <TextField
          name="message"
          value={form.message}
          multiline
          onChange={handleChange}
          placeholder="Complaint reason"
          rowsMax={4}
          margin="dense"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onDismissCb}
          color="secondary"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={loading}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  )
}
