import {patch} from './api/restClient'
import {urlsUser} from './api/urls'
import {history} from '../store'
import {FCMType} from '../enums/fcm-type.enum'

let push: PhonegapPluginPush.PushNotification
let token = ''
let savedTokenForAccessToken = ''

export async function registerInFCMAndGetToken(): Promise<string> {
  if (!window.PushNotification) {
    return ''
  }

  if (push) {
    console.warn('FCM already registered')
    return token
  }

  push = window.PushNotification.init({
    android: {},
    ios: {
      alert: 'true',
      badge: true,
    },
    windows: {},
  })

  push.on('notification', (data) => {
    const isFromOnNotifyTapFromPhoneTaskBar = Boolean(data.additionalData && data.additionalData.foreground === false)

    // redierect to dialog on notify tap
    if (isFromOnNotifyTapFromPhoneTaskBar && data.additionalData.type === FCMType.match && data.additionalData.foreground === false) {
      history.push(`/im/dialog/${data.additionalData.dialogId}`)
    }

    // redierect to dialog on notify tap
    if (isFromOnNotifyTapFromPhoneTaskBar && data.additionalData.type === FCMType.message && data.additionalData.foreground === false) {
      history.push(`/im/dialog/${data.additionalData.dialogId}`)
    }

    /*
   When you receive a background push on iOS you will be given 30 seconds of time in which to complete a task.
   If you spend longer than 30 seconds on the task the OS may decide that your app
   is misbehaving and kill it. In order to signal iOS that your on('notification')
   handler is done you will need to call the new push.finish() method.
    */
    push.finish(
      () => null,
      () => null,
      data.additionalData && data.additionalData.notId ? String(data.additionalData.notId) : undefined,
    )
  })

  return new Promise((resolve) => {
    push.on('registration', data => {
      token = data.registrationId
      resolve(data.registrationId)
    })
  })
}

export function saveFCMToken(accessToken: any) {
  if (savedTokenForAccessToken === accessToken) {
    return
  }

  if (token && String(token).trim().length > 0 && accessToken) {
    // save token on server
    patch(urlsUser.saveFcm(), {
      remove: false,
      token,
    }, accessToken).then(() => {
      savedTokenForAccessToken = accessToken
    }).catch(e => {
      console.warn('Cant save fcm token on server')
      console.error(e)
    })
  }
}

export function removeFCMToken(accessToken: string) {
  if (!accessToken) {
    return
  }

  patch(urlsUser.saveFcm(), {
    remove: true,
    token,
  }, accessToken).then(() => {
    savedTokenForAccessToken = ''
  }).catch(e => {
    console.warn('Cant remove fcm token on server')
    console.error(e)
  })
}
