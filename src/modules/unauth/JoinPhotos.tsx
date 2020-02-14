import React, {useState} from 'react'
import {Photo} from '../../interfaces/Photo'
import {CardActions} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import CardContent from '@material-ui/core/CardContent'
import Card from '@material-ui/core/Card'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory} from 'react-router'

import {PhotosChanger} from '../../shared-components/PhotosChanger'
import {StateApp} from '../../interfaces/StateApp'
import './JoinPhotos.scss'
import {SmallTip} from '../../shared-components/SmallTip'
import {JoinSteps} from './components/JoinSteps'
import {saveJoinData} from '../../store/actions/join'

export function JoinPhotos() {
  const joinForm = useSelector((state: StateApp) => state.join)
  const dispatch = useDispatch()
  const history = useHistory()
  const [disabled, setDisabled] = useState(true)
  const [photos, setPhotos] = useState<Photo[]>([])

  const onChange = (photos: Photo[]) => {
    setPhotos(photos)

    const hasNSFW = photos.some(p => p.isNSFW)
    const hasNotUploaded = photos.some(p => !p.id)

    setDisabled(hasNSFW || hasNotUploaded || photos.length === 0)
  }

  const next = () => {
    dispatch(saveJoinData({...joinForm, photos}))
    history.push('/unauth/join-finish')
  }

  return (
    <Container>
      <JoinSteps activeStep={2}/>
      <Card className="join-photos">
        <CardContent>
          <SmallTip>
            <>
              Upload at least one, or better a few photos,
              they will be available to all users when viewing your profile
            </>
          </SmallTip>
          <PhotosChanger
            photos={photos}
            onChange={onChange}
          />
        </CardContent>
        <CardActions
          className="join-photos__actions"
        >
          <Button
            variant="contained"
            color="primary"
            onClick={next}
            disabled={disabled}
          >
            Next
          </Button>
        </CardActions>
      </Card>
    </Container>
  )
}
