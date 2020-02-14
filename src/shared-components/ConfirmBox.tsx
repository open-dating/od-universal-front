import React from 'react'
import ReactDOM from 'react-dom'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'

function ConfirmBox(
  {
    text,
    reject,
    resolve,
    cancelText,
    okText,
    hideCancel,
  }: {
    text: string,
    reject: () => void,
    resolve: () => void,
    cancelText: string,
    okText: string,
    hideCancel: boolean,
  },
) {

  return (
    <Dialog
      open={true}
      onClose={reject}
    >
      <DialogContent>
        {text}
      </DialogContent>
      <DialogActions>
        {!hideCancel && (
          <Button
            onClick={reject}
            color="secondary"
          >
            {cancelText}
          </Button>
        )}
        <Button
          onClick={resolve}
          color="primary"
        >
          {okText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export const promptConfirmBox = (text: string, {
  okText = 'Ok',
  cancelText = 'Cancel',
  hideCancel = false,
} = {}): Promise<any> => {
  const wrapper = document.body.appendChild(document.createElement('div'))

  const removeBox = () => {
    ReactDOM.unmountComponentAtNode(wrapper)
    setTimeout(() => document.body.removeChild(wrapper))
  }

  const promise = new Promise((resolve, reject) => {
    try {
      ReactDOM.render(
        <ConfirmBox
          text={text}
          okText={okText}
          cancelText={cancelText}
          resolve={resolve}
          reject={reject}
          hideCancel={hideCancel}
        />,
        wrapper,
      )
    } catch (e) {
      console.error(e)
      throw e
    }
  })

  return promise.then(() => {
    removeBox()
    return Promise.resolve()
  }).catch(() => {
    removeBox()
    return hideCancel ? Promise.resolve() : Promise.reject()
  })
}
