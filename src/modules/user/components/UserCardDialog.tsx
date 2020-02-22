import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import {useTranslation} from 'react-i18next'

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
  const {t} = useTranslation()
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
      <DialogTitle>{t('user.matchDialogTitle')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('user.matchDialogTip')}
        </DialogContentText>
        <TextField
          name="text"
          value={form.text}
          multiline
          onChange={handleChange}
          placeholder={t('user.matchDialogPlaceholder')}
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
          {t('user.matchDialogSkip')}
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={loading}
        >
          {t('user.matchDialogSend')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
