import React from 'react'
import Container from '@material-ui/core/Container'

import {AdminList} from './components/AdminList'
import {urlsAdmin} from '../../services/api/urls'
import {NavState} from '../../interfaces/NavState'
import {AdminComplaintItem} from './components/AdminComplaintItem'
import {ToolbarAdmin} from './components/ToolbarAdmin'
import {Complaint} from '../../interfaces/Complaint'

export function Complaints() {
  const endpoint = (nav: NavState) => urlsAdmin.complaints(nav)
  const columns = ['id', 'dialogId', 'text', 'location', 'fromUser', 'toUser']

  return (
    <>
      <ToolbarAdmin/>
      <Container>
        <AdminList
          columns={columns}
          endpoint={endpoint}
          itemList={(item: Complaint) => {
            return <AdminComplaintItem
              complaint={item}
              key={item.id}
              columns={columns}
            />
          }}
        />
      </Container>
    </>
  )
}
