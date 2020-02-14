import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import Container from '@material-ui/core/Container'
import {useRouteMatch} from 'react-router-dom'

import './Profile.scss'
import {StateApp} from '../../interfaces/StateApp'
import {get} from '../../services/api/restClient'
import {urlsUser} from '../../services/api/urls'
import {UserProfile} from '../../interfaces/UserProfile'
import {UserCard} from './components/UserCard'
import {StateFetch} from '../../interfaces/StateFetch'
import {FetchError} from '../../shared-components/FetchError'
import {SpinnerPrefetch} from '../../shared-components/SpinnerPrefetch'

export function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const userData = useSelector((state: StateApp) => state.user)
  const match = useRouteMatch('/user/profile/:id')
  const [fetchState, setFetchState] = useState<StateFetch>({
    loading: false,
    error: null,
  })

  const userId = Number((match?.params as any)?.id)
  const token = userData.jwt?.accessToken

  useEffect(() => {
    const fetchData = async () => {
      setFetchState({
        loading: true,
        error: null,
      })
      try {
        const res = await get(
          urlsUser.profile(userId),
          token,
        )

        setUser(res.data)
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
  }, [userId, token])

  return (
    <div className="profile">
      {fetchState.error && (
        <Container>
          <FetchError error={fetchState.error}/>
        </Container>
      )}
      {fetchState.loading && (
        <SpinnerPrefetch/>
      )}
      {user && <UserCard
        user={user}
        disableActions={true}
      />}
    </div>
  )
}
