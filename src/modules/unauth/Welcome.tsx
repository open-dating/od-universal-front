import React from 'react'
import Button from '@material-ui/core/Button'
import {useHistory} from 'react-router-dom'

import './Welcome.scss'
import {ToolbarMain} from '../../shared-components/ToolbarMain'

export function Welcome() {
  const history = useHistory()

  return (
    <>
      <ToolbarMain/>
      <div className="welcome">
        <div className="welcome__buttons">
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.push('/unauth/signin')}
          >Sign in</Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => history.push('/unauth/join-selfie')}
          >Join</Button>
        </div>
      </div>
    </>
  )
}
