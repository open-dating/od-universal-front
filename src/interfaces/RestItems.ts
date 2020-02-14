export interface RestItems<T> {
  data: T[]
  _meta: {
    totalCount: number
    page: number
    limit: number
    perPage: number
  }
}
