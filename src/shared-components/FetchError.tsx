import React from 'react'
import { Alert, AlertTitle } from '@material-ui/lab'

import './FetchError.scss'
import {recognizeError} from '../utils/errorHelpers'

export function FetchError({error}: {error: any}) {
  const message = recognizeError(error)

  return (
    <Alert
      className="fetch-error"
      severity="error"
    >
      <AlertTitle>Error</AlertTitle>
      {message}
    </Alert>
  )
}
