import React from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

import {Complaint} from '../../../interfaces/Complaint'
import {UserProfile} from '../../../interfaces/UserProfile'

export function AdminComplaintItem({complaint, columns}: { complaint: Complaint, columns: string[]}) {
  return (
    <TableRow
      hover
    >
      {columns.map((prop, i) => {
        if (prop === 'dialogId') {
          return (<TableCell key={`${complaint.id}_${i}`}>
            <a
              href={`/im/dialog/${complaint.dialogId}`}
              target="_blank"
              rel="noopener noreferrer"
            >{complaint.dialogId}</a>
          </TableCell>)
        }
        if (prop === 'fromUser' || prop === 'toUser') {
          const user: UserProfile = (complaint as any)[prop]
          return (<TableCell key={`${complaint.id}_${i}`}>
            <a
              href={`/user/profile/${user.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >{user.firstname}</a>
          </TableCell>)
        }

        return <TableCell key={`${complaint.id}_${i}`}>{(complaint as any)[prop]}</TableCell>
      })}
    </TableRow>
  )
}
