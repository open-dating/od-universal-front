import React from 'react'
import Swipe, {EasySwipeProps} from 'react-easy-swipe'

interface Props extends EasySwipeProps {
  disableActions: boolean
}

export function SwipeContainer(props: any) {
  const {disableActions, children} = props

  const passProps = {...props}
  delete passProps.disableActions

  return (
    disableActions ? (
      children
    ) : (
      <Swipe {...passProps}/>
    )
  )
}
