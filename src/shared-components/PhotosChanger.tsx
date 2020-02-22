import React from 'react'
import Grid from '@material-ui/core/Grid'
import BrowserImageManipulation from 'browser-image-manipulation'
import Paper from '@material-ui/core/Paper'
import DeleteIcon from '@material-ui/icons/Delete'
import Fab from '@material-ui/core/Fab'
import {useTranslation} from 'react-i18next'

import {urlsPhoto} from '../services/api/urls'
import {post} from '../services/api/restClient'
import {UploadBtnBig} from './UploadBtnBig'
import {PhotosChangerPhotoCaption} from './PhotosChangerPhotoCaption'
import './PhotosChanger.scss'
import {Photo} from '../interfaces/Photo'
import {recognizeError} from '../utils/errorHelpers'

export function PhotosChanger(
  {
    photos,
    onChange,
  }: {
    photos: Photo[],
    onChange: (photos: Photo[]) => void
  },
) {
  const {t} = useTranslation()

  const sm = photos.length > 0 ? 6 : 12

  const fileChange = (e: any) => {
    const files = e.target.files || e.dataTransfer.files
    if (!files.length) {
      return null
    }

    uploadFile(files[0])
  }

  const uploadFile = async (blob: Blob) => {
    const next: Photo = {
      id: 0,
      isNSFW: false,
      url: '',
      base64: '',
      error: null,
    }
    const nextPhotos = [...photos, next]

    try {
      next.base64 = await new BrowserImageManipulation()
        .loadBlob(blob, {
          fixOrientation: true,
        })
        .resize(800, 800)
        .saveAsImage()

      onChange([...nextPhotos])

      const fd = new FormData()
      fd.append('file', blob)

      const {data}: {data: Photo} = await post(urlsPhoto.upload(), fd)

      if (data.isNSFW) {
        throw new Error(t('sharedComponents.nsfwPhotoErr'))
      }

      next.id = data.id
      next.url = data.url
      next.isNSFW = data.isNSFW
      delete next.base64
    } catch (e) {
      next.error = recognizeError(e)
    } finally {
      onChange([...nextPhotos])
    }
  }

  const removePhoto = (photo: Photo) => {
    onChange(photos.filter(v => v !== photo))
  }

  return (
    <Grid
      container
      spacing={2}
      className="photos-changer"
    >
      {photos.map((photo: Photo, i: number) => (
        <Grid
          key={i}
          item
          xs={12}
          sm={sm}
          className="photos-changer__item"
        >
          <Paper
            square
            className="photos-changer__item__paper"
          >
            <div
              className="photos-changer__item__paper__photo"
              style={{
                backgroundImage: `url(${photo.base64 ? photo.base64 : `${photo.url}`})`,
              }}
            >
              <div className="photos-changer__item__paper__photo__actions">
                {(photo.id || photo.error) && (<Fab
                  color="secondary"
                  onClick={() => removePhoto(photo)}
                >
                  <DeleteIcon/>
                </Fab>)}
              </div>
              <div className="photos-changer__item__paper__photo__caption">
                <PhotosChangerPhotoCaption
                  className="photos-changer__item__paper__photo__caption__content"
                  photo={photo}
                />
              </div>
            </div>
          </Paper>
        </Grid>
      ))}
      {photos.length < 6 && (
        <Grid
          item
          xs={12}
          sm={sm}
          className="photos-changer__item photos-changer__item--add"
        >
          <div className="photos-changer__item__paper">
            <div className={photos.length > 0 ? 'photos-changer__item__paper__photo' : ''}>
              <UploadBtnBig
                onChange={(evt) => fileChange(evt)}
              />
            </div>
          </div>
        </Grid>
      )}
    </Grid>
  )
}
