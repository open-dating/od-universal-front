import {ImDialog} from './ImDialog'
import {Photo} from './Photo'
import {UserGender} from '../enums/user-gender.enum'
import {UserUseType} from '../enums/user-use-type.enum'
import {Complaint} from './Complaint'

export interface UserProfile {
  id: number
  email: string
  unreadDialogs: ImDialog[]
  photos: Photo[]
  firstname: string
  cubeDistance: number|null
  locationDistance: number|null
  height: number
  weight: number
  age: number
  role: string
  gender: UserGender
  useType: UserUseType
  language: string
  complaintsToUser?: Complaint[]
  setting?: {
    searchRadius: number
    minAge: number
    maxAge: number
    searchGender: UserGender
  }
  location?: {
    type: 'Point',
    coordinates: number[]
  }
  bio: string
  habits?: any
}
