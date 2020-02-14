import React, {useEffect, useState} from 'react'

import './ProfileSummaryStatistic.scss'
import {useSelector} from 'react-redux'
import {StateApp} from '../../../interfaces/StateApp'
import {get} from '../../../services/api/restClient'
import {urlsStatistic} from '../../../services/api/urls'
import {StateFetchAnyItem} from '../../../interfaces/StateFetchAnyItem'
import {UserStatistic} from '../../../interfaces/UserStatistic'
import {FetchError} from '../../../shared-components/FetchError'
import {LineChart} from '../../../shared-components/LineChart'

export function ProfileSummaryStatistic() {
  const userData = useSelector((state: StateApp) => state.user)
  const [stat, setStat] = useState<StateFetchAnyItem<UserStatistic>>({item: null, loading: true, error: null})

  const token = userData.jwt?.accessToken
  const userId = Number(userData.profile?.id)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStat({item: null, loading: true, error: null})

        const resp = await get(urlsStatistic.user(userId), token)

        setStat({item: resp.data, loading: false, error: null})
      } catch (e) {
        console.error(e)
        setStat({item: null, loading: false, error: e})
      }
    }

    fetchData()
  }, [token, userId])

  return (
    <div className="profile-summary-statistic">
      {stat.loading && (<div>loading...</div>)}
      {stat.error && (<FetchError error={stat.error}/>)}
      {stat.item && (<div>
        <LineChart
          titles={[
            'My likes',
            'My passes',
            'Matches',
            'Liked me',
            'Pass me',
          ]}
          cols={[
            stat.item.likes,
            stat.item.passes,
            stat.item.matches,
            stat.item.likesFromOtherUsers,
            stat.item.passesFromOtherUsers,
          ]}
        />
      </div>)}
    </div>
  )
}
