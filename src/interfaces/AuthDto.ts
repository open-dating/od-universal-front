import {UserProfile} from './UserProfile'
import {JWT} from './JWT'

export interface AuthDto {
  profile: UserProfile
  jwt: JWT
}
