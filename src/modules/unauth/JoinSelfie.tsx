import React, {ChangeEvent, useEffect, useRef, useState} from 'react'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import {CardContent} from '@material-ui/core'
import CardActions from '@material-ui/core/CardActions'
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate'
import Container from '@material-ui/core/Container'
import {useHistory} from 'react-router'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'

import {UploadBtnBig} from '../../shared-components/UploadBtnBig'
import {post} from '../../services/api/restClient'
import {urlsPhoto} from '../../services/api/urls'
import {Photo} from '../../interfaces/Photo'
import {StateApp} from '../../interfaces/StateApp'
import './JoinSelfie.scss'
import {JoinSteps} from './components/JoinSteps'
import {saveJoinData} from '../../store/actions/join'
import {requestPermission} from '../../services/permissions'
import {openMessageBox} from '../../shared-components/MessageBox'
import {drawLandmarks} from '../../utils/drawLandmarks'
import {promptConfirmBox} from '../../shared-components/ConfirmBox'

export function JoinSelfie() {
  const joinForm = useSelector((state: StateApp) => state.join)
  const dispatch = useDispatch()
  const history = useHistory()
  const videoEl = useRef<HTMLVideoElement|null>(null)
  const [showScreenshot, setShowScreenshot] = useState(false)
  const [showWebcamFallback, setShowWebcamFallback] = useState(false)
  const [face, setFace] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const stream = useRef<MediaStream|null>(null)
  const {t} = useTranslation()

  const resetScreen = () => {
    setShowScreenshot(false)
    setFace(null)
  }

  const fileChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.target && evt.target.files && evt.target.files.length) {
      uploadFile(evt.target.files[0])
    }
  }

  const uploadFile = async (blob: Blob|File|null) => {
    if (!blob || loading) {
      return
    }

    try {
      setLoading(true)

      const fd = new FormData()
      fd.append('file', blob)

      const {data}: {data: Photo} = await post(urlsPhoto.upload(), fd)

      if (data.isNSFW) {
        throw new Error(t('unauth.imageIsNsfwErr'))
      }
      if (Array.isArray(data.allFacesEncoding) && data.allFacesEncoding.length < 1) {
        throw new Error(t('unauth.imageNoFacesErr'))
      }
      if (Array.isArray(data.allFacesEncoding) && data.allFacesEncoding.length > 1) {
        throw new Error(t('unauth.imageManyPeopleErr'))
      }

      if (Array.isArray(data.allFacesLandmarks) && data.allFacesLandmarks.length > 0) {
        try {
          data.url = await drawLandmarks(data.url, data.allFacesLandmarks[0])
        } catch (e) {
          console.error(e)
          openMessageBox(t('unauth.imageDrawErr'))
        }
      }

      setLoading(false)
      setFace(data)
      setShowScreenshot(true)
      setDisabled(false)
    } catch (e) {
      console.error(e)
      openMessageBox(e)
      setLoading(false)
    }
  }

  const takeScreen = () => {
    if (!videoEl.current) {
      return
    }

    const canvas = document.createElement('canvas')

    canvas.height = videoEl.current.videoHeight
    canvas.width = videoEl.current.videoWidth
    const ctx = canvas.getContext('2d')
    ctx?.drawImage(videoEl.current, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(b => uploadFile(b))
  }

  useEffect(() => {
    const getWebcamSource = async () => {
      await promptConfirmBox(
        t('unauth.selfieInfoPromt'),
        {hideCancel: true},
      )

      try {
        await requestPermission('CAMERA')

        stream.current = await navigator.mediaDevices.getUserMedia({video: true})
        if (videoEl.current) {
          videoEl.current.srcObject = stream.current
        }
      } catch (e) {
        console.warn(e)
        setShowWebcamFallback(true)
      }
    }

    getWebcamSource()

    return () => {
      if (stream.current) {
        stream.current.getTracks().forEach((track: any) => track.stop())
      }
    }

  // eslint-disable-next-line
  }, [stream])

  const next = () => {
    dispatch(saveJoinData({...joinForm, selfie: face}))
    history.push('/unauth/join-photos')
  }

  const classes = ['selfie']
  if (showWebcamFallback) {
    classes.push('selfie--with-fallback')
  }
  if (showScreenshot) {
    classes.push('selfie--with-screenshot')
  }
  if (loading) {
    classes.push('selfie--loading')
  }

  return (
    <Container>
      <JoinSteps activeStep={1}/>
      <Card className={classes.join(' ')}>
        <CardContent className="selfie__content">
          {showScreenshot && (
            <div className="selfie__screenshot">
              <img src={face.url} alt=""/>
            </div>
          )}
          <div className="selfie__fallback">
            {!showScreenshot && <UploadBtnBig
              loading={loading}
              onChange={fileChange}
            />}
          </div>
          <div className="selfie__webcam">
            <video autoPlay={true} ref={videoEl}/>
          </div>
        </CardContent>
        <CardActions disableSpacing className="selfie__actions">
          {showScreenshot && (
            <Button
              variant="contained"
              color="primary"
              onClick={resetScreen}
            >
              {t('unauth.reset')}
            </Button>
          )}
          {!showScreenshot && !showWebcamFallback && (
            <div className="selfie__actions___subactions">
              <Button
                variant="contained"
                color="primary"
                disabled={loading}
                className="selfie__actions___subactions__upload-btn"
              >
                <AddPhotoAlternateIcon/>
                <input
                  type="file"
                  onChange={fileChange}
                />
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={takeScreen}
                disabled={loading}
              >
                {loading ? t('unauth.processing') : t('unauth.takeShot')}
              </Button>
            </div>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={next}
            disabled={disabled}
          >
            {t('unauth.next')}
          </Button>
        </CardActions>
      </Card>
    </Container>
  )
}
