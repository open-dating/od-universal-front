import React from 'react'
import Button from '@material-ui/core/Button'
import {useHistory} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import './Welcome.scss'
import {ToolbarMain} from '../../shared-components/ToolbarMain'

export function Welcome() {
  const history = useHistory()
  const {t} = useTranslation()

  return (
    <>
      <ToolbarMain/>
      <div className="welcome">
        <div className="welcome__buttons">
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.push('/unauth/signin')}
          >{t('unauth.signIn')}</Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => history.push('/unauth/join-selfie')}
          >{t('unauth.join')}</Button>
        </div>
      </div>
    </>
  )
}
