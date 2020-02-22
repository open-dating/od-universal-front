import React from 'react'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import {useHistory} from 'react-router'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'

import './ProfileSummaryInfo.scss'
import {removeUserData} from '../../../store/actions/user'
import {StateApp} from '../../../interfaces/StateApp'
import {promptConfirmBox} from '../../../shared-components/ConfirmBox'
import {remove} from '../../../services/api/restClient'
import {urlsSystem} from '../../../services/api/urls'
import {openMessageBox} from '../../../shared-components/MessageBox'

export function ProfileSummaryInfo() {
  const {t} = useTranslation()
  const userData = useSelector((state: StateApp) => state.user)
  const history = useHistory()
  const dispatch = useDispatch()

  const token = userData.jwt?.accessToken
  const userId = Number(userData.profile?.id)

  const removeProfile = async () => {
    try {
      await promptConfirmBox(t('common.areYouSure'))
    } catch (e) {
      return
    }

    try {
      await remove(urlsSystem.removeProfile(userId), token)

      dispatch(removeUserData(token || ''))
    } catch (e) {
      console.error(e)
      openMessageBox(e)
    }
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
        {userData.profile?.firstname} [<Link href="#" onClick={goToProfile}>{t('user.seeProfile')}</Link>]
      </div>
      <div className="profile-summary-info__actions">
        <Button
          variant="contained"
          onClick={logout}
        >
          {t('user.logout')}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={removeProfile}
        >
          {t('user.removeProfile')}
        </Button>
      </div>
    </div>
  )
}
