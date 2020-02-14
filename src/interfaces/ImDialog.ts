import {UserProfile} from './UserProfile'
import {ImMessage} from './ImMessage'

export interface ImDialog {
  id: number
  users: UserProfile[]
  lastMessage: ImMessage|null
  lastActivityAt: Date
  isBlocked: boolean
}
