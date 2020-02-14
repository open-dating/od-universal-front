import React from 'react'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import ChatIcon from '@material-ui/icons/Chat'
import NotListedLocationIcon from '@material-ui/icons/NotListedLocation'
import Badge from '@material-ui/core/Badge'
import BarChartIcon from '@material-ui/icons/BarChart'
import {useHistory} from 'react-router'
import {useSelector} from 'react-redux'
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt'

import {StateApp} from '../interfaces/StateApp'
import './ToolbarMain.scss'

const valuePathMap: { [key: string]: string } = {
  'welcome': '/unauth/welcome',
  'im': '/im/dialogs',
  'search': '/user/search-near',
  'profile': '/user/profile-summary',
  'statistic': '/statistic/',
}

export function ToolbarMain() {
  const userData = useSelector((state: StateApp) => state.user)
  const router = useSelector((state: StateApp) => state.router)
  const history = useHistory()

  const isUserLogged = Boolean(userData.jwt?.accessToken)

  let selected = null
  for (const key in valuePathMap) {
    if (valuePathMap[key] === router.location.pathname) {
      selected = key
      break
    }
  }

  const onChange = (_: any, key: React.ReactText) => {
    history.push(valuePathMap[key])
  }

  return (
    <div className="toolbar-main">
      <BottomNavigation
        value={selected}
        onChange={onChange}
        showLabels={false}
      >
        {isUserLogged && (
          <BottomNavigationAction
            value="im"
            label="Dialogs"
            icon={(
              <Badge
                color="secondary"
                variant="dot"
                invisible={userData.profile?.unreadDialogs.length === 0}
              >
                <ChatIcon/>
              </Badge>
            )}
          />)}
        {isUserLogged && (<BottomNavigationAction
          value="search"
          label="Search"
          icon={<NotListedLocationIcon/>}
        />)}
        {isUserLogged && (<BottomNavigationAction
          value="profile"
          label="Profile"
          icon={<PermIdentityIcon/>}
        />)}

        {!isUserLogged && (
          <BottomNavigationAction
            value="welcome"
            label="Join or sign in"
            icon={<SentimentSatisfiedAltIcon/>}
          />
        )}

        <BottomNavigationAction
          className="toolbar-main__only-full-width"
          value="statistic"
          label="Statistic"
          icon={<BarChartIcon/>}
        />
      </BottomNavigation>
    </div>
  )
}
