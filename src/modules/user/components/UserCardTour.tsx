import React from 'react'
import Button from '@material-ui/core/Button'
import {useDispatch} from 'react-redux'
import IconSwipeLeft from '@material-ui/icons/Favorite'
import IconSwipeRight from '@material-ui/icons/Favorite'

import {setUserCardTour} from '../../../store/actions/tour'
import './UserCardTour.scss'

export function UserCardTour() {
  const dispatch = useDispatch()

  const stopTour = () => dispatch(setUserCardTour(true))

  return (
    <div className="user-card-tour">
      <div className="user-card-tour__blocks">
        <div className="user-card-tour__left">
          <IconSwipeLeft className="user-card-tour__icon"/>
          <div>Swipe left to skip</div>
        </div>
        <div className="user-card-tour__vertical-delimiter"/>
        <div className="user-card-tour__right">
          <IconSwipeRight className="user-card-tour__icon"/>
          <div>Swipe right to like
            (if you also like, you can write
            each other)
          </div>
        </div>
        <div className="user-card-tour__bottom">
          Scroll down to see more photos and information about the person
        </div>
        <div className="user-card-tour__confirm">
          <Button
            variant="contained"
            color="primary"
            onClick={stopTour}
          >
            Ok
          </Button>
        </div>
      </div>

      <div className="user-card-tour__dnn-heart">
       AI prediction
      </div>
      <div className="user-card-tour__dnn-heart__hole"/>
    </div>
  )
}
