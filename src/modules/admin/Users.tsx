import React from 'react'
import Container from '@material-ui/core/Container'

import {AdminUserItem} from './components/AdminUserItem'
import {AdminList} from './components/AdminList'
import {UserProfile} from '../../interfaces/UserProfile'
import {urlsAdmin} from '../../services/api/urls'
import {NavState} from '../../interfaces/NavState'
import {ToolbarAdmin} from './components/ToolbarAdmin'

export function Users() {
  const endpoint = (nav: NavState) => urlsAdmin.users(nav)
  const columns = ['id', 'firstname', 'age', 'gender', 'useType', 'dialogs', 'complaintsToUser']

  return (
    <>
      <ToolbarAdmin/>
      <Container>
        <AdminList
          columns={columns}
          endpoint={endpoint}
          itemList={(item: UserProfile) => {
            return <AdminUserItem
              user={item}
              key={item.id}
              columns={columns}
            />
          }}
        />
      </Container>
    </>
  )
}
