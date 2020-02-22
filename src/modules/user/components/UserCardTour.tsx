import React from 'react'
import Button from '@material-ui/core/Button'
import {useDispatch} from 'react-redux'
import IconSwipeLeft from '@material-ui/icons/Favorite'
import IconSwipeRight from '@material-ui/icons/Favorite'
import {useTranslation} from 'react-i18next'

import {setUserCardTour} from '../../../store/actions/tour'
import './UserCardTour.scss'

export function UserCardTour() {
  const {t} = useTranslation()
  const dispatch = useDispatch()

  const stopTour = () => dispatch(setUserCardTour(true))

  return (
    <div className="user-card-tour">
      <div className="user-card-tour__blocks">
        <div className="user-card-tour__left">
          <IconSwipeLeft className="user-card-tour__icon"/>
          <div>{t('user.tourSkip')}</div>
        </div>
        <div className="user-card-tour__vertical-delimiter"/>
        <div className="user-card-tour__right">
          <IconSwipeRight className="user-card-tour__icon"/>
          <div>{t('user.tourLike')}</div>
        </div>
        <div className="user-card-tour__bottom">
          {t('user.tourScrollBtm')}
        </div>
        <div className="user-card-tour__confirm">
          <Button
            variant="contained"
            color="primary"
            onClick={stopTour}
          >
            {t('user.tourOk')}
          </Button>
        </div>
      </div>

      <div className="user-card-tour__dnn-heart">
        {t('user.tourPrediction')}
      </div>
      <div className="user-card-tour__dnn-heart__hole"/>
    </div>
  )
}
