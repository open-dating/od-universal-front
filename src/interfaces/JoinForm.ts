import {Photo} from './Photo'

export interface JoinForm {
  form: any
  selfie: Photo|null
  photos: Photo[]
}
