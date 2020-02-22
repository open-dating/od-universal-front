import React, {useEffect, useState} from 'react'
import Container from '@material-ui/core/Container'
import {useTranslation} from 'react-i18next'

import './SearchNear.scss'
import {get, post} from '../../services/api/restClient'
import {urlsChoice, urlsIm, urlsUser} from '../../services/api/urls'
import {useSelector} from 'react-redux'
import {StateApp} from '../../interfaces/StateApp'
import {UserProfile} from '../../interfaces/UserProfile'
import {UserCard} from './components/UserCard'
import {SpinnerPrefetch} from '../../shared-components/SpinnerPrefetch'
import {StateFetch} from '../../interfaces/StateFetch'
import {FetchError} from '../../shared-components/FetchError'

export function SearchNear() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loadNext, setLoadNext] = useState(false)
  const [fetchState, setFetchState] = useState<StateFetch>({
    loading: false,
    error: null,
  })
  const userData = useSelector((state: StateApp) => state.user)
  const tour = useSelector((state: StateApp) => state.tour)
  const {t} = useTranslation()

  const accessToken = userData?.jwt?.accessToken

  useEffect(() => {
    const fetchData = async () => {
      setFetchState({
        loading: true,
        error: null,
      })
      try {
        const res = await get(
          urlsUser.searchNear(),
          accessToken,
        )

        setUsers(items => [...items, ...res.data.data])
        setLoadNext(false)
        setFetchState({
          loading: false,
          error: null,
        })
      } catch (error) {
        console.error(error)
        setFetchState({
          loading: false,
          error,
        })
      }
    }

    fetchData()
  }, [accessToken, loadNext])

  const likeUser = (user: UserProfile) => {
    return post(urlsChoice.like(user.id), {}, userData?.jwt?.accessToken)
  }

  const passUser = (user: UserProfile) => {
    return post(urlsChoice.pass(user.id), {}, userData?.jwt?.accessToken)
  }

  const onChoosed = (user: UserProfile, e?: Error|undefined) => {
    const nextData = users.filter(u => u.id !== user.id)

    setUsers(nextData)

    if (nextData.length < 3) {
      setLoadNext(true)
    }
  }

  const sendMatchMessage = (dialog: any, text: string) => {
    return post(
      urlsIm.sendMessage(),
      {
        dialogId: dialog.id,
        text,
      },
      accessToken,
    )
  }

  const [user, nextUser] = users

  return (
    <div className="search-near">
      {!user && fetchState.loading && (
        <Container>
          <SpinnerPrefetch/>
        </Container>
      )}
      {!user && !fetchState.loading && !fetchState.error && (
        <Container className="search-near__message">
          <div>{t('user.peopleNotFound')}</div>
        </Container>
      )}
      {!user && fetchState.error && (
        <Container className="search-near__message">
          <FetchError error={fetchState.error}/>
        </Container>
      )}
      {user && (
        <div className="search-near__user-cards">
          <UserCard
            key={user.id}
            user={user}
            showTour
            tour={tour}
            likeUser={likeUser}
            passUser={passUser}
            onLike={onChoosed}
            onPass={onChoosed}
            sendMatchMessage={sendMatchMessage}
            disableActions={false}
          />
          {
            /*
            key next_wrap and next_card for
            so that there are no glitches when swiping and updating data
             */
            nextUser && (
              <div
                className="search-near__user-cards__next-user"
                key={`next_wrap_${nextUser.id}`}
              >
                <UserCard
                  key={`next_card_${nextUser.id}`}
                  user={nextUser}
                  disableActions={true}
                />
              </div>
            )}
        </div>)}
    </div>
  )
}
