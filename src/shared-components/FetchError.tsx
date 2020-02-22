import React from 'react'
import {Alert, AlertTitle} from '@material-ui/lab'
import {useTranslation} from 'react-i18next'

import './FetchError.scss'
import {recognizeError} from '../utils/errorHelpers'

export function FetchError({error}: { error: any }) {
  const message = recognizeError(error)
  const {t} = useTranslation()

  return (
    <Alert
      className="fetch-error"
      severity="error"
    >
      <AlertTitle>{t('sharedComponents.error')}</AlertTitle>
      {message}
    </Alert>
  )
}
