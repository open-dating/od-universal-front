import {UserProfile} from './UserProfile'

export interface Complaint {
  id: number
  fromUser: UserProfile
  toUser: UserProfile
  text: string
  location: string
  dialogId: string|null
  status: string
  createdAt: string|Date
}
