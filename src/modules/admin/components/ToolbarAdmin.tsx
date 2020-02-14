import React from 'react'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import {useHistory} from 'react-router'
import {useSelector} from 'react-redux'

import {StateApp} from '../../../interfaces/StateApp'

const valuePathMap: { [key: string]: string } = {
  'users': '/admin/users',
  'complaints': '/admin/complaints',
}

export function ToolbarAdmin() {
  const router = useSelector((state: StateApp) => state.router)
  const history = useHistory()

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
        showLabels={true}
      >
        <BottomNavigationAction
          value="users"
          label="users"
        />
        <BottomNavigationAction
          value="complaints"
          label="complaints"
        />
      </BottomNavigation>
    </div>
  )
}
