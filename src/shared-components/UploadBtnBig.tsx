import React, {ChangeEvent} from 'react'
import Button from '@material-ui/core/Button'
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate'
import {getRandom} from './../utils/random'

import './UploadBtnBig.scss'

export function UploadBtnBig({loading, onChange}: {loading?: boolean, onChange: (evt: ChangeEvent<HTMLInputElement>) => void}) {
  // always render new button, for upload duplicate photos
  const uniqKey = getRandom()

  return (
    <div className="upload-btn-big">
      <Button
        variant="contained"
        color="primary"
        disabled={loading}
        className="upload-btn-big__btn"
      >
        <AddPhotoAlternateIcon/>
      </Button>
      <input
        key={uniqKey}
        type="file"
        onChange={onChange}
      />
    </div>
  )
}
