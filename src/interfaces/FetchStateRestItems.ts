import {RestItems} from './RestItems'

export interface FetchStateRestItems<T> {
  loading: boolean
  dto: RestItems<T>
  error: null
}
