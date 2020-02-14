import React from 'react'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import {useHistory} from 'react-router'
import {useDispatch, useSelector} from 'react-redux'

import './ProfileSummaryInfo.scss'
import {removeUserData} from '../../../store/actions/user'
import {StateApp} from '../../../interfaces/StateApp'

export function ProfileSummaryInfo() {
  const userData = useSelector((state: StateApp) => state.user)
  const history = useHistory()
  const dispatch = useDispatch()

  const token = userData.jwt?.accessToken

  const removeProfile = () => {

  }

  const logout = () => {
    dispatch(removeUserData(token || ''))
  }

  const goToProfile = (e: React.BaseSyntheticEvent) => {
    e.preventDefault()

    history.push(`/user/profile/${userData.profile?.id}`)
  }

  return (
    <div className="profile-summary-info">
      <div>
        {userData.profile?.firstname} [<Link href="#" onClick={goToProfile}>see profile</Link>]
      </div>
      <div className="profile-summary-info__actions">
        <Button
          variant="contained"
          onClick={logout}
        >
          Logout
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={removeProfile}
        >
          Remove profile
        </Button>
      </div>
    </div>
  )
}
