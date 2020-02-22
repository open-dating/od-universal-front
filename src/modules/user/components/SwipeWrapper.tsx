import React from 'react'
import Swipe, {EasySwipeProps} from 'react-easy-swipe'

interface Props extends EasySwipeProps {
  disableActions: boolean
}

export function SwipeWrapper(props: Props): JSX.Element {
  const nextProps = {...props}
  delete nextProps.disableActions

  return (
    props.disableActions ? (
      props.children
    ) : (
      <Swipe {...nextProps}/>
    )
  )
}
