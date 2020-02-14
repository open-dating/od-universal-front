import {ImDialog} from './ImDialog'
import {UserProfile} from './UserProfile'
import {Photo} from './Photo'

export interface ImMessage {
  id: number
  dialog: ImDialog
  fromUser: UserProfile
  text: string
  photo: Photo|null
}
