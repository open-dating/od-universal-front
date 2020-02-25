import React, {useEffect, useState} from 'react'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Container from '@material-ui/core/Container'
import {useSelector, useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'

import './ProfileSummary.scss'
import {get} from '../../services/api/restClient'
import {urlsUser} from '../../services/api/urls'
import {StateApp} from '../../interfaces/StateApp'
import {StateFetch} from '../../interfaces/StateFetch'
import {FetchError} from '../../shared-components/FetchError'
import {SpinnerPrefetch} from '../../shared-components/SpinnerPrefetch'
import {saveUserData} from '../../store/actions/user'
import {ProfileSummaryInfo} from './components/ProfileSummaryInfo'
import {ProfileSummaryPhotos} from './components/ProfileSummaryPhotos'
import {ProfileSummarySettingsEdit} from './components/ProfileSummarySettingsEdit'
import {ProfileSummaryStatistic} from './components/ProfileSummaryStatistic'
import {ProfileSummaryProfileEdit} from './components/ProfileSummaryProfileEdit'

export function ProfileSummary() {
  const dispatch = useDispatch()
  const userData = useSelector((state: StateApp) => state.user)
  const [activePanel, setActivePanel] = useState()
  const [fetchState, setFetchState] = useState<StateFetch>({
    loading: false,
    error: null,
  })
  const {t} = useTranslation()

  const token = userData.jwt?.accessToken

  useEffect(() => {
    const fetchData = async () => {
      setFetchState({
        loading: true,
        error: null,
      })
      try {
        const res = await get(
          urlsUser.myProfile(),
          token,
        )

        dispatch(saveUserData({profile: res.data}))
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
  }, [dispatch, token])

  const changeActivePanel = (panel: string) => {
    if (activePanel === panel) {
      setActivePanel('')
    } else {
      setActivePanel(panel)
    }
  }

  return (
    <div className="profile-summary">
      <Container>
        <div>
          {fetchState.error && (
            <FetchError error={fetchState.error}/>
          )}
          {fetchState.loading && (
            <SpinnerPrefetch/>
          )}
          <ExpansionPanel
            expanded={activePanel === 'info'}
            onChange={() => changeActivePanel('info')}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon/>}
            >
              {t('user.info')}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <ProfileSummaryInfo/>
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <ExpansionPanel
            expanded={activePanel === 'photos'}
            onChange={() => changeActivePanel('photos')}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon/>}
            >
              {t('user.photos')}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <ProfileSummaryPhotos/>
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <ExpansionPanel
            expanded={activePanel === 'search-settings'}
            onChange={() => changeActivePanel('search-settings')}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon/>}
            >
              {t('user.searchSettings')}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <ProfileSummarySettingsEdit/>
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <ExpansionPanel
            expanded={activePanel === 'profile-edit'}
            onChange={() => changeActivePanel('profile-edit')}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon/>}
            >
              {t('user.profileEdit')}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <ProfileSummaryProfileEdit/>
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <ExpansionPanel
            expanded={activePanel === 'statistic'}
            onChange={() => changeActivePanel('statistic')}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon/>}
            >
              {t('user.statistic')}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <ProfileSummaryStatistic/>
            </ExpansionPanelDetails>
          </ExpansionPanel>

        </div>
      </Container>
    </div>
  )
}
