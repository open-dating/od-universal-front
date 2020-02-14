import React from 'react'

import './UserCardPhoto.scss'
import {Photo} from '../../../interfaces/Photo'

export function UserCardPhoto({photo}: {photo: Photo}) {
  const classes = ['user-card-photo']
  const style = {}

  return (
    <div
      className={classes.join(' ')}
      style={style}
    >
      <figure
        className="user-card-photo__pic"
      >
        <img
          width={photo.width}
          height={photo.height}
          src={photo.url}
          alt=""
        />
        <div
          className="user-card-photo__pic__pc-drag-preventer"
        />
      </figure>
    </div>
  )
}
