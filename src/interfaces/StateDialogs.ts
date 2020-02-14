import {ImDialog} from './ImDialog'

export interface StateDialogs {
  loading: boolean
  error: any
  dto: {
    data: ImDialog[],
    _meta: {
      skip: number
      limit: number
      nextSkip: number
    }
  }
}
