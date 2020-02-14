import React from 'react'
import FavoriteIcon from '@material-ui/icons/Favorite'
import Tooltip from '@material-ui/core/Tooltip'

import './UserCardDnnHeart.scss'
import {UserProfile} from '../../../interfaces/UserProfile'

export function UserCardDnnHeart({user}: {user: UserProfile}) {

  let dnnPercent = Math.round((1 - (user.cubeDistance || 1)) * 100)

  // for best center fit
  if (dnnPercent >= 100) {
    dnnPercent = 99
  } else if (dnnPercent < 10) {
    dnnPercent = 10
  }

  return (
    <div className="user-card-dnn-heart">
      <div className="user-card-dnn-heart__count">
        <Tooltip
          title="Yor percent"
          placement="left"
          disableFocusListener
        >
          <span>{dnnPercent}%</span>
        </Tooltip>
      </div>
      <div className="user-card-dnn-heart__icon">
        <FavoriteIcon/>
      </div>
    </div>
  )
}
