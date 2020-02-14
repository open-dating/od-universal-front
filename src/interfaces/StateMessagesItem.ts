import {ImMessage} from './ImMessage'
import {ImDialog} from './ImDialog'

export interface StateMessagesItem {
  loading: boolean
  error: any
  dto: {
    data: ImMessage[],
    _meta: {
      limit: number
      minId: number
      dialog: ImDialog
    }
  }
}
