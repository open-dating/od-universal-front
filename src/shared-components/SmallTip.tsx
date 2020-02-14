import React, {ReactElement} from 'react'

import './SmallTip.scss'

export function SmallTip({children}: {children: ReactElement}) {
  return (
    <div className="small-tip">
      <small>
        {children}
      </small>
    </div>
  )
}
