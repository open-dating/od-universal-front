import {DemographyStatDto} from '../../../interfaces/DemographyStatDto'
import {UserGender} from '../../../enums/user-gender.enum'

export function calcTotal(items: DemographyStatDto[], gender?: UserGender) {
  let total = 0

  for (const item of items) {
    if (gender && gender === item.gender) {
      total += +item.count
    } else if (!gender) {
      total += +item.count
    }
  }

  return total
}
