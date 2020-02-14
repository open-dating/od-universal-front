import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import Button from '@material-ui/core/Button'
import CloseIcon from '@material-ui/icons/Close'
import ReactDOM from 'react-dom'

import {MessageBoxType} from '../enums/message-box-type.enum'
import {recognizeError} from '../utils/errorHelpers'

interface MessageBoxData {
  message: string
  messageType: MessageBoxType|null
}

function MessageBox(
  {
    data,
    removeBox,
  }: {
    data: MessageBoxData,
    removeBox: () => void
  },
) {

  const onClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    removeBox()
  }

  return (
    <Snackbar
      open={Boolean(data.message)}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <SnackbarContent
        message={data.message}
        action={
          <Button
            color="secondary"
            size="small"
            onClick={onClose}
          >
            <CloseIcon/>
          </Button>
        }
      />
    </Snackbar>
  )
}

export const openMessageBox = (errorOrMsg: any, messageType: MessageBoxType = MessageBoxType.error) => {
  const wrapper = document.body.appendChild(document.createElement('div'))

  const removeBox = () => {
    ReactDOM.unmountComponentAtNode(wrapper)
    setTimeout(() => document.body.removeChild(wrapper))
  }

  ReactDOM.render(
    <MessageBox
      data={{message: recognizeError(errorOrMsg), messageType}}
      removeBox={removeBox}
    />,
    wrapper,
  )
}
