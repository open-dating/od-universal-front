import React from 'react'

import './FormItem.scss'

export function FormItem(props: any) {
  const classes = ['form-item']

  if (props.center) {
    classes.push('form-item--center')
  }

  return (
    <div className={classes.join(' ')}>
      {props.children}
    </div>
  )
}
