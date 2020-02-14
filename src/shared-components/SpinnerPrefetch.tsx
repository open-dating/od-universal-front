import React from 'react'
import {CircularProgress} from '@material-ui/core'

import './SpinnerPrefetch.scss'

export function SpinnerPrefetch() {
  return (
    <div className="spinner-prefetch">
      <div className="spinner-prefetch__element">
        <CircularProgress/>
      </div>
    </div>
  )
}
