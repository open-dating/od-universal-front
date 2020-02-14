import {JoinForm} from '../../interfaces/JoinForm'
import {JOIN_DATA_SAVE} from '../actionTypes'

export const saveJoinData = (joinForm: JoinForm) => ({
  type: JOIN_DATA_SAVE,
  joinForm,
})
