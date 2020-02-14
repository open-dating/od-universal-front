import {UserProfile} from './UserProfile'
import {JWT} from './JWT'

export interface StateUser {
  profile: UserProfile|null
  jwt: JWT|null
}
