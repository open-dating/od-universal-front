/// <reference types="react-scripts" />

declare module 'cordova' {
  import 'phonegap-plugin-push'
  import * as cordova from 'cordova'

  interface CordovaPermissionsStatus {
    hasPermission: boolean
  }

  interface CordovaPermissions {
    requestPermission(name: string, onSuccessCb: (PermissionsStatus) => void, onFailCb: () => void)
    [key: string]: string
  }

  interface CordovaPlugins {
    permissions: CordovaPermissions
  }
}

declare module 'react-easy-swipe' {
  import * as React from 'react'

  export interface EasySwipeProps extends React.HTMLAttributes<HTMLDivElement> {
    tagName?: string
    className?: string
    style?: object
    children: React.ReactNode
    allowMouseEvents?: boolean,
    onSwipeUp?: (event: Event) => void
    onSwipeDown?: (event: Event) => void
    onSwipeLeft?: (event: Event) => void
    onSwipeRight?: (event: Event) => void
    onSwipeStart?: (event: Event) => void
    onSwipeMove?: (position: any, event: Event) => void
    onSwipeEnd?: (event: Event) => void
  }

  declare const reactEasySwipe: React.ComponentType<EasySwipeProps>

  export default reactEasySwipe
}
