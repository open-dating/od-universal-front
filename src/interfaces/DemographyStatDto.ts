import {UserGender} from '../enums/user-gender.enum'

export interface DemographyStatDto {
  gender: UserGender
  bdayYYYY: string
  count: number
}
