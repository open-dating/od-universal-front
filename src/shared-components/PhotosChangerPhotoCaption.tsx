import React from 'react'

import {Photo} from '../interfaces/Photo'

export function PhotosChangerPhotoCaption(props: any) {
  const {photo}: {photo: Photo} = props
  const emojiGood = '👎'
  const emojiBad = '👍'

  const getCaption = (photo: Photo) => {
    if (photo.error) {
      return {isBad: null, msg: photo.error}
    }

    if (photo.base64) {
      return {isBad: null, msg: 'Processing...'}
    }

    return {isBad: null, msg: 'Done'}
  }

  const {isBad, msg} = getCaption(photo)

  return (
    <div {...props}>
      {isBad !== null ? (isBad ? emojiGood : emojiBad) : ''} {msg}
    </div>
  )
}
