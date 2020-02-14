import {StateDialogs} from '../../interfaces/StateDialogs'
import {ImDialog} from '../../interfaces/ImDialog'
import {
  DIALOGS_CREATE_OR_UPDATE,
  DIALOGS_UPDATE,
  DIALOGS_UPDATE_FAIL,
  DIALOGS_UPDATE_START,
} from '../actionTypes'
import {uniqItems} from '../utils/uniqItems'

const initialDialogs: StateDialogs = {
  loading: true,
  error: null,
  dto: {
    data: [],
    _meta: {
      skip: 0,
      limit: 0,
      nextSkip: 0,
    },
  },
}

export const dialogs = (
  state = initialDialogs,
  {type, data, dialog, error}: { type: string, data?: any, dialog?: ImDialog, error?: any},
): StateDialogs => {
  if (type === DIALOGS_UPDATE) {
    const items = uniqItems<ImDialog>([
      ...state.dto.data,
      ...(data.data as ImDialog[]),
    ]).sort(reorderDialogsByLastActivityDate)
      .filter(excludeBlocked)

    return {
      loading: false,
      error: null,
      dto: {
        data: items,
        _meta: data._meta,
      },
    }
  }

  if (type === DIALOGS_CREATE_OR_UPDATE) {
    const itemsWithRemovedOldDialog = state.dto.data
      .filter(d => d.id !== dialog?.id)

    const items = uniqItems<ImDialog>([
      ...itemsWithRemovedOldDialog,
      (dialog as ImDialog),
    ]).sort(reorderDialogsByLastActivityDate)
      .filter(excludeBlocked)

    return {
      loading: false,
      error: null,
      dto: {
        data: items,
        _meta: state.dto._meta,
      },
    }
  }

  if (type === DIALOGS_UPDATE_START) {
    return {
      ...state,
      error: null,
      loading: true,
    }
  }

  if (type === DIALOGS_UPDATE_FAIL) {
    return {
      ...state,
      error,
      loading: false,
    }
  }

  return state
}


function reorderDialogsByLastActivityDate(a: ImDialog, b: ImDialog) {
  const aDt = +new Date(a.lastActivityAt)
  const bDt = +new Date(b.lastActivityAt)

  return bDt - aDt
}

function excludeBlocked(a: ImDialog) {
  return !a.isBlocked
}
