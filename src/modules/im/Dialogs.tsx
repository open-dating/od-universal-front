import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {StateApp} from '../../interfaces/StateApp'
import {List} from '@material-ui/core'
import {DialogItem} from './components/DialogItem'
import Container from '@material-ui/core/Container'
import {useRouteMatch} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import './Dialogs.scss'
import {fetchDialogs} from '../../store/actions/dialogs'
import {SpinnerPrefetch} from '../../shared-components/SpinnerPrefetch'
import {ToolbarMain} from '../../shared-components/ToolbarMain'
import {FetchError} from '../../shared-components/FetchError'
import {openMessageBox} from '../../shared-components/MessageBox'

const fetchNextOnScrollSize = 150

export function Dialogs() {
  const {t} = useTranslation()
  const userData = useSelector((state: StateApp) => state.user)
  const dispatch = useDispatch()
  const dialogs = useSelector((state: StateApp) => state.dialogs)
  const [nextSkip, setNextSkip] = useState(0)
  const match = useRouteMatch('/im/dialogs/:userId')

  const token = userData.jwt?.accessToken
  const userId = Number((match?.params as any)?.userId || userData.profile?.id)

  useEffect(() => {
    dispatch(fetchDialogs({
      token,
      userId,
      nextSkip,
    }))
  }, [dispatch, token, userId, nextSkip])

  // listen scroll
  useEffect(() => {
    const scrollGuard = () => {
      const scrollH = document.documentElement.scrollHeight
      const scrollTop = document.documentElement.scrollTop
      const clientH = document.documentElement.clientHeight
      const btmOffset = scrollH - (scrollTop + clientH)

      if (btmOffset < fetchNextOnScrollSize) {
        if (!dialogs.loading) {
          setNextSkip(dialogs.dto._meta.nextSkip)
        }
      }

      // keep scroll position
      if (btmOffset < 2) {
        window.scrollTo(0, scrollTop + clientH - 2)
      }
    }

    window.addEventListener('scroll', scrollGuard)

    return () => window.removeEventListener('scroll', scrollGuard)
  }, [dialogs])

  const noDialogs = !dialogs.loading && !dialogs.error && dialogs.dto.data.length === 0
  const nextDialogsFetchError = !dialogs.loading && dialogs.error && dialogs.dto.data.length
  const dialogsFirstFetchError = !dialogs.loading && dialogs.error && !dialogs.dto.data.length

  if (nextDialogsFetchError) {
    openMessageBox(dialogs.error)
  }

  return (
    <>
      <ToolbarMain/>
      <Container className="dialogs">
        {dialogs.loading && (
          <SpinnerPrefetch/>
        )}
        {noDialogs && (
          <List>
            <li>
              {t('im.noSympathies')}
            </li>
          </List>
        )}
        {!noDialogs && (
          <List>
            {dialogs.dto.data.map(dialog =>
              <DialogItem
                key={dialog.id}
                dialog={dialog}
                user={userData.profile}
              />,
            )}
          </List>
        )}
        {dialogsFirstFetchError && (
          <FetchError error={dialogs.error}/>
        )}
      </Container>
    </>
  )
}
