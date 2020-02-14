import {MessageBoxType} from '../enums/message-box-type.enum'

export interface StateMessageBox {
  message: string
  messageType: MessageBoxType|null
}
