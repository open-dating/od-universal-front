import {CordovaPermissionsStatus, CordovaPlugins} from 'cordova'

export function requestPermission (name: string = 'CAMERA'): Promise<void|string> {
  const hasCordova = window && window.cordova

  if (!hasCordova) {
    return Promise.resolve()
  }

  const permissions = (window.cordova.plugins as CordovaPlugins).permissions

  return new Promise((resolve, reject) => {
    const grantTo = permissions[name] || name
    permissions.requestPermission(grantTo, function (status: CordovaPermissionsStatus ) {
      if (status.hasPermission) {
        resolve()
      } else {
        reject(`Error on permission request ${grantTo}, status: ${status.hasPermission}`)
      }
    }, () => reject(`Error on permission request ${grantTo}`))
  })
}
