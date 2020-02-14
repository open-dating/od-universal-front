import {UserProfile} from '../../src/interfaces/UserProfile'
import {UserGender} from '../../src/enums/user-gender.enum'
import {UserUseType} from '../../src/enums/user-use-type.enum'

class User implements UserProfile {
  age = 20
  cubeDistance = 0.34
  firstname = 'sdfsdf'
  gender = UserGender.Male
  height = 1
  id = 1
  locationDistance = null
  photos = [
    {id: 1, url: 'http://photo.url', isNSFW: false},
  ]
  role = 'user'
  unreadDialogs = []
  useType = UserUseType.Other
  weight = 13
}

export function createUserMock(id: number): User {
  const u = new User()
  u.photos[0].url = `http://photo-of-user-${id}`
  u.firstname = `firstname of user ${id}`
  return u
}
