import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import SendIcon from '@material-ui/icons/Send'
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate'
import DeleteIcon from '@material-ui/icons/Delete'
import Container from '@material-ui/core/Container'
import {useTranslation} from 'react-i18next'

import './MessageForm.scss'
import {ImMessageForm} from '../../../interfaces/ImMessageForm'
import {openMessageBox} from '../../../shared-components/MessageBox'

export function MessageForm(
  {
    sendMessage,
    afterSend,
    uploadImage,
  }: {
    sendMessage: (f: any) => Promise<any>,
    afterSend: (f: any) => void,
    uploadImage: (f: File) => Promise<any>,
  },
) {
  const {t} = useTranslation()
  const [form, setForm] = useState<ImMessageForm>({
    image: null,
    text: '',
  })
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)

  const maxRow = 4

  const send = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    if (loading || imageLoading) {
      return
    }

    if (!form.image && !form.text) {
      return
    }

    try {
      setLoading(true)

      const {data} = await sendMessage(form)

      setForm({
        image: null,
        text: '',
      })

      setLoading(false)
      afterSend(data)
    } catch (e) {
      console.error(e)
      openMessageBox(e)
      setLoading(false)
    }
  }

  const removeAttachedImage = () => {
    setForm(f => ({...f, image: null}))
  }

  const attachImage = async (event: any) => {
    if (loading || imageLoading) {
      return
    }

    const files = event.target.files || event.dataTransfer.files
    if (!files.length) {
      return null
    }

    try {
      setImageLoading(true)

      const {data} = await uploadImage(files[0] as File)

      setForm({...form, image: data})
    } catch (e) {
      console.error(e)
    } finally {
      setImageLoading(false)
    }
  }

  const handleChange = (event: any) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const imageUploaded = Boolean(form.image && form.image.url)

  return (
    <div className="message-form">
      <Container>
        <form
          onSubmit={send}
          className="message-form__form"
        >
          <div className="message-form__form__left">
            {imageUploaded ? (
              <div
                className="message-form__form__left__image"
              >
                <div
                  className="message-form__form__left__image__remove"
                >
                  <DeleteIcon/>
                </div>
                <img
                  className="message-form__form__left__image__pic"
                  src={`${form.image?.url}`}
                  alt=""
                  onClick={removeAttachedImage}
                />
              </div>
            ) : (
              <Button
                color="primary"
                disabled={imageLoading === true || loading === true}
              >
                <React.Fragment>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={attachImage}
                    className="message-form__form__left__file-input"
                  />
                  <AddPhotoAlternateIcon/>
                </React.Fragment>
              </Button>
            )}
          </div>
          <div className="message-form__form__data">
            <TextField
              name="text"
              value={form.text}
              multiline
              onChange={handleChange}
              placeholder={t('im.writeMsgPlaceholder')}
              rowsMax={maxRow}
            />
          </div>
          <div className="message-form__form__right">
            <Button
              type="submit"
              color="primary"
              disabled={loading === true}
            >
              <SendIcon/>
            </Button>
          </div>
        </form>
      </Container>
    </div>
  )
}
