import React from 'react'
import {useTranslation} from 'react-i18next'

import {Photo} from '../interfaces/Photo'

export function PhotosChangerPhotoCaption(props: any) {
  const {t} = useTranslation()

  const {photo}: {photo: Photo} = props
  const emojiGood = '👎'
  const emojiBad = '👍'

  const getCaption = (photo: Photo) => {
    if (photo.error) {
      return {isBad: null, msg: photo.error}
    }

    if (photo.base64) {
      return {isBad: null, msg: t('sharedComponents.photoProcessing')}
    }

    return {isBad: null, msg: t('sharedComponents.photoGood')}
  }

  const {isBad, msg} = getCaption(photo)

  return (
    <div {...props}>
      {isBad !== null ? (isBad ? emojiGood : emojiBad) : ''} {msg}
    </div>
  )
}
