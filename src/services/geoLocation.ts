import {requestPermission} from './permissions'
import {patch} from './api/restClient'
import {urlsUser} from './api/urls'

let oldLocation: Position|null = null

export async function getGeoLocation(): Promise<Position> {
  await requestPermission('ACCESS_FINE_LOCATION')

  if (!navigator.geolocation) {
    throw new Error('Fail, no geolocation support')
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (loc: Position) => {
        oldLocation = loc
        resolve(loc)
      },
      e => {
        if (oldLocation) {
          console.warn('Return old location')
          resolve(oldLocation)
        } else {
          console.warn(e)
          reject(new Error('Cant detect location'))
        }
      },
    )
  })
}

let locationWatchId: number
export async function listenLocationChange(token: string) {
  if (!token) {
    return
  }

  await requestPermission('ACCESS_FINE_LOCATION')

  if (!navigator.geolocation) {
    throw new Error('Fail, no geolocation support')
  }

  if (locationWatchId) {
    navigator.geolocation.clearWatch(locationWatchId)
  }

  locationWatchId = navigator.geolocation.watchPosition(location => {
    patch(urlsUser.saveLocation(), {
      location: {
        type: 'Point',
        coordinates: [
          location.coords.longitude,
          location.coords.latitude,
        ],
      },
    }, token).catch(e => {
      console.warn('Cant save new location')
      console.error(e)
    })
  })
}
