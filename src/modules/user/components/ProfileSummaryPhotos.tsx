import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'

import './ProfileSummaryPhotos.scss'
import {PhotosChanger} from '../../../shared-components/PhotosChanger'
import {Photo} from '../../../interfaces/Photo'
import {patch} from '../../../services/api/restClient'
import {urlsUser} from '../../../services/api/urls'
import {openMessageBox} from '../../../shared-components/MessageBox'
import {saveUserData} from '../../../store/actions/user'
import {StateApp} from '../../../interfaces/StateApp'
import {MessageBoxType} from '../../../enums/message-box-type.enum'

export function ProfileSummaryPhotos() {
  const {t} = useTranslation()
  const userData = useSelector((state: StateApp) => state.user)
  const [disabled, setDisabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const [photos, setPhotos] = useState<Photo[]>([...userData.profile?.photos || []])
  const token = userData.jwt?.accessToken

  const onChange = (photos: Photo[]) => {
    setPhotos(photos)

    const hasNSFW = photos.some(p => p.isNSFW)
    const hasNotUploaded = photos.some(p => !p.id)

    setDisabled(hasNSFW || hasNotUploaded || photos.length === 0)
  }

  const save = async () => {
    if (disabled || loading) {
      return
    }

    try {
      setLoading(true)

      const profile = userData.profile || {}

      const res = await patch(urlsUser.myProfileSave(), {
        ...profile,
        photosIds: photos.map(p => p.id),
      }, token)

      dispatch(saveUserData({
        profile: {
          ...profile,
          ...res.data,
        },
      }))

      setLoading(false)

      openMessageBox(t('common.saved'), MessageBoxType.success)
    } catch (e) {
      console.error(e)
      setLoading(false)
      openMessageBox(e)
    }
  }

  return (
    <div className="profile-summary-photos">
      <PhotosChanger
        photos={photos}
        onChange={onChange}
      />
      <div className="profile-summary-photos__actions">
        <Button
          variant="contained"
          color="primary"
          onClick={save}
          disabled={disabled}
        >
          {loading ? t('common.saveWait') : t('common.save')}
        </Button>
      </div>
    </div>
  )
}
