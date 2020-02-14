import {StateUser} from './StateUser'
import {History} from 'history'
import {JoinForm} from './JoinForm'
import {StateDialogs} from './StateDialogs'
import {StateMessages} from './StateMessages'
import {StateTour} from './StateTour'
import {StateMessageBox} from './StateMessageBox'

export interface StateApp {
  user: StateUser
  router: History
  join: JoinForm
  tour: StateTour
  dialogs: StateDialogs
  messages: StateMessages
  messageBox: StateMessageBox
}
