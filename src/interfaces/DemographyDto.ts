import {DemographyStatDto} from './DemographyStatDto'

export interface DemographyDto {
  [aplha2CountryCode: string]: {
    countryName: string,
    raw: DemographyStatDto[],
  }
}
