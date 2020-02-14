import {FaceLandmarks} from './FaceLandmarks'

export interface Photo {
  id: number
  isNSFW: boolean
  url: string
  width?: number
  height?: number
  base64?: string
  error?: any
  allFacesEncoding?: number[][]
  allFacesLandmarks?: FaceLandmarks[]
}
