import React from 'react'

import './FormTitle.scss'

export function FormTitle({title, subTitle = ''}: {title: string, subTitle?: string}) {
  return (
    <div className="form-title">
      <div>
        {title}
      </div>
      <small>
        {subTitle}
      </small>
    </div>
  )
}
