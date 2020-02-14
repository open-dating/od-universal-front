import {JoinForm} from '../../interfaces/JoinForm'
import {JOIN_DATA_SAVE} from '../actionTypes'

const initialJoinForm: JoinForm = {
  selfie: null,
  photos: [],
  form: null,
}

export const join = (state = initialJoinForm, {type, joinForm}: {type: string, joinForm: JoinForm}): JoinForm => {
  if (type === JOIN_DATA_SAVE) {
    return {...joinForm}
  }
  return state
}
