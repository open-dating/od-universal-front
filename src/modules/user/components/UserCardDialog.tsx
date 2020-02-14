import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import {ImMessageForm} from '../../../interfaces/ImMessageForm'
import {ImDialog} from '../../../interfaces/ImDialog'
import {openMessageBox} from '../../../shared-components/MessageBox'

export function UserCardDialog(
  {
    dialog,
    sendMatchMessage,
    onDoneCb,
  }: {
    dialog: ImDialog,
    sendMatchMessage: (d: ImDialog, text: string) => Promise<any>,
    onDoneCb: () => void
  },
) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<ImMessageForm>({
    image: null,
    text: '',
  })

  const handleChange = (event: any) => {
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
      if (form.text.length < 1) {
        return
      }

      setLoading(true)
      await sendMatchMessage(dialog, form.text)

      setLoading(true)
      onDoneCb()
    } catch (e) {
      console.error(e)
      openMessageBox(e)
      onDoneCb()
    }
  }

  return (
    <Dialog
      open={true}
      onClose={onDoneCb}
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle>Hooray!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Its a match! You can sent smt good...
        </DialogContentText>
        <TextField
          name="text"
          value={form.text}
          multiline
          onChange={handleChange}
          placeholder="Write message..."
          rowsMax={4}
          margin="dense"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onDoneCb}
          color="secondary"
          disabled={loading}
        >
          Skip
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
